import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "@/lib/mongodb"; // Import the MongoDB connection utility

export const POST = async (req) => {
  try {
    const { email, password } = await req.json();

    const collection = db.collection("AIR_ADMINS"); // Replace with your collection name

    // Find the user by email
    const user = await collection.findOne({ email });

    if (!user) {
      return NextResponse.json({ msg: "User not found!" }, { status: 404 });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) {
      return NextResponse.json({ msg: "Password is wrong!" }, { status: 400 });
    }

    // Remove the password field from the user object before sending the response
    delete user.password;

    return NextResponse.json(
      { ...user },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};