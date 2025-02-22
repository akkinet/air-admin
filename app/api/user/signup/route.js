import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "@/lib/mongodb"; // Import the MongoDB connection utility

export const POST = async (req) => {
  try {
    const body = await req.json();

    // Hash the password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(body.password, salt);
    delete body.password;

    // Get the MongoDB client
    const collection = db.collection("AIR_ADMINS"); // Replace with your collection name

    // Insert the new user into the collection
    const result = await collection.insertOne({
      ...body,
      password: hashedPassword,
    });

    // Check if the insertion was successful
    if (!result.acknowledged) {
      throw new Error("Failed to insert user into the database");
    }

    return NextResponse.json(
      { message: "Successfully signed up" },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};