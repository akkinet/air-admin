import { NextResponse } from "next/server";
import db from "@/lib/mongodb"; // Import the MongoDB connection utility

export const GET = async (req) => {
  try {

    const UserQuery = db.collection("UserQuery");
    const userQueries = await UserQuery.find().toArray();

    if (!userQueries.length) {
      return NextResponse.json({ message: "No records found" }, { status: 404 });
    }

    return NextResponse.json(userQueries);
  } catch (error) {
    console.error("Error retrieving records:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
