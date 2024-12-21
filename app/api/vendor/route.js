import { PutCommand, ScanCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "@/config/docClient";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      firstName,
      lastName,
      email,
      corporateName,
      opCoverage,
      addressLine1,
      addressLine2,
      city,
      state,
      zipCode,
      phone,
      additionalPhone,
      socialLinks,
      branches, // Array of branches
    } = body;

    if (!firstName || !lastName || !email || !addressLine1) {
      return new Response(
        JSON.stringify({ message: "Required fields are missing" }),
        { status: 400 }
      );
    }

    const counterParams = {
      TableName: "AIR_COUNTER",
      Key: {
        id: "vendor_id",
      },
      UpdateExpression: "SET #cnt = if_not_exists(#cnt, :start) + :incr",
      ExpressionAttributeNames: {
        "#cnt": "count",
      },
      ExpressionAttributeValues: {
        ":incr": 1,
        ":start": 0,
      },
      ReturnValues: "UPDATED_NEW",
    };

    const counterResp = await ddbDocClient.send(
      new UpdateCommand(counterParams)
    );
    const vendorId = counterResp.Attributes.count;
    const s3 = new S3Client();

    if (branches && branches.length > 0) {
      for (const branch of branches) {
        const file = branch.file;
        const { fileName, filePreview, fileType } = file;
        const fileBuffer = Buffer.from(filePreview.split(",")[1], "base64");
        const lastDot = fileName.lastIndexOf(".");
        const file_name = fileName.slice(0, lastDot);
        const extension = fileName.slice(lastDot + 1);
        const newFileName = `vendors/${vendorId}/${file_name}_${new Date().getTime()}.${extension}`;
        const params = {
          Bucket: "medicom.hexerve",
          Key: newFileName,
          Body: fileBuffer,
          ContentType: fileType,
        };
        await s3.send(new PutObjectCommand(params));
        branch.file = `https://s3.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_S3_BUCKET}/${newFileName}`;
      }
    }

    const params = {
      TableName: "AIR_VENDOR",
      Item: {
        ID: vendorId,
        firstName,
        lastName,
        corporateName,
        opCoverage,
        branches,
        email,
        addressLine1,
        addressLine2,
        city,
        additionalPhone,
        state,
        zipCode,
        phone,
        socialLinks,
        branches: branches || [], // Store branches or empty array if none
        createdAt: new Date().toISOString(),
      },
    };

    await ddbDocClient.send(new PutCommand(params));

    return new Response(
      JSON.stringify({ message: "Vendor data stored successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("DynamoDB Error:", error);
    return new Response(
      JSON.stringify({ message: "Failed to store data", error }),
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try{
    const params = {
      TableName: "AIR_VENDOR",
    };

    const data = await ddbDocClient.send(new ScanCommand(params));
    return new Response(
      JSON.stringify(data.Items),
      { status: 200 }
    );
  }catch(error){
    console.error("DynamoDB Error:", error);
    return new Response(
      JSON.stringify({ message: "Failed to fetch data", error }),
      { status: 500 }
    );
  }
}