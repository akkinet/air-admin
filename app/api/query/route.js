import { NextResponse } from "next/server";
import { ddbDocClient } from "@/config/docClient";
import { PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";

export const GET = async (req) => {
  try{
    const params = {
      TableName: "AIR_USER_QUERY",
    };

    const result = await ddbDocClient.send(new ScanCommand(params));

    if (!result.Items) {
      return NextResponse.status(404).json({ message: "Record not found" });
    }

    return NextResponse.json(result.Items);
  }catch(err){
    console.error("Error retrieving records:", err);
    return NextResponse.json({ err }, { status: 500 });
  }
}