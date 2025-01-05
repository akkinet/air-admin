import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "@/config/docClient";

export async function PUT(req, ctx) {
  try{
    const id = (await ctx.params).id;
    const params = {
      TableName: "AIR_VENDOR",
      Key: {
        ID: Number(id),
      },
      ExpressionAttributeValues: {
        ":verified": true
      },
      UpdateExpression: "set verified = :verified",
      ReturnValues: "UPDATED_NEW",
    };
    await ddbDocClient.send(new UpdateCommand(params));
    return new Response(
      JSON.stringify({ message: "Vendor verified successfully" }),
      { status: 200 }
    );
  }catch(error){
    console.error("DynamoDB Error:", error);
    return new Response(
      JSON.stringify({ message: "Failed to update data", error }),
      { status: 500 }
    );
  }
}