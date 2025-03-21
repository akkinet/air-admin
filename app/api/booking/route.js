import db from "@/lib/mongodb";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const Booking = db.collection("Booking");
    const filter = {};
    if (status) filter.status = status;

    const allBooking = await Booking.find(filter).toArray();
    return NextResponse.json(allBooking);
  } catch (err) {
    console.error("error", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};
