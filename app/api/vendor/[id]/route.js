import { NextResponse } from "next/server";
import db from "@/lib/mongodb"; // Import the MongoDB connection utility

export async function PUT(req, ctx) {
  try {
    const id = (await ctx.params).id; // Get the vendor ID from the URL params

    const vendorsCollection = db.collection("AIR_VENDOR");

    // Update the vendor's `verified` status
    const result = await vendorsCollection.updateOne(
      { _id: id }, // Filter by vendor ID
      { $set: { verified: true } } // Update the `verified` field
    );

    // Check if the update was successful
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: "Vendor not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Vendor verified successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("MongoDB Error:", error);
    return NextResponse.json(
      { message: "Failed to update data", error: error.message },
      { status: 500 }
    );
  }
}