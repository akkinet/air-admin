import { NextResponse } from "next/server";
import db from "@/lib/mongodb"; // Import the MongoDB connection utility
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      firstName,
      lastName,
      email,
      corporateName,
      operationCoverage,
      addressLine1,
      addressLine2,
      city,
      state,
      zipCode,
      phone,
      additionalPhone,
      socialLinks,
      branches, // Array of branches
      businessDescription,
    } = body;
    const vendorsCollection = db.collection("AIR_VENDORS");
    // Insert the vendor data into MongoDB
    const vendorData = {
      firstName,
      lastName,
      corporateName,
      operationCoverage,
      email,
      addressLine1,
      addressLine2,
      city,
      additionalPhone,
      state,
      zipCode,
      phone,
      socialLinks,
      verified: false,
      businessDescription,
      branches: [], // Initialize branches as empty (will be updated after S3 upload)
      createdAt: new Date().toISOString(),
    };
    const result = await vendorsCollection.insertOne(vendorData);
    const vendorId = result.insertedId; // Get the auto-generated _id from MongoDB
    // Upload branch files to S3 (if applicable)
    const s3 = new S3Client();
    if (branches && branches.length > 0) {
      for (const branch of branches) {
        const file = branch.file;
        const { fileName, filePreview, fileType } = file;
        const fileBuffer = Buffer.from(filePreview.split(",")[1], "base64");
        const lastDot = fileName.lastIndexOf(".");
        const file_name = fileName.slice(0, lastDot);
        const extension = fileName.slice(lastDot + 1);
        const newFileName = `vendors/${vendorId}/${file_name}_${new Date().getTime()}.${extension}`; // Use vendorId in the file path
        const params = {
          Bucket: process.env.AWS_S3_BUCKET,
          Key: newFileName,
          Body: fileBuffer,
          ContentType: fileType,
        };
        await s3.send(new PutObjectCommand(params));
        branch.file = `https://s3.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_S3_BUCKET}/${newFileName}`;
      }
      // Update the vendor document with the branches (including S3 file URLs)
      await vendorsCollection.updateOne(
        { _id: vendorId },
        { $set: { branches } }
      );
    }

    return NextResponse.json(
      { message: "Vendor data stored successfully", vendorId },
      { status: 200 }
    );
  } catch (error) {
    console.error("MongoDB Error:", error);
    return NextResponse.json(
      { message: "Failed to store data", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const vendorsCollection = db.collection("AIR_VENDORS");

    const vendors = await vendorsCollection.find().toArray();

    return NextResponse.json(vendors, { status: 200 });
  } catch (error) {
    console.error("MongoDB Error:", error);
    return NextResponse.json(
      { message: "Failed to fetch data", error: error.message },
      { status: 500 }
    );
  }
}
