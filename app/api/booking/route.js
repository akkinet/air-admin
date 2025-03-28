import db from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

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

export const POST = async (req) => {
  try {
    const { id, segmentIndex, newPrice, currency } = await req.json();

    // Validate input
    if (!id || segmentIndex === undefined || !newPrice || !currency) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const Booking = db.collection("Booking");
    const booking = await Booking.findOne({ _id: new ObjectId(id) });

    if (!booking) {
      return NextResponse.json(
        { error: `No booking found with id: ${id}` },
        { status: 404 }
      );
    }

    // Check if segment exists
    if (!booking.segments[segmentIndex]) {
      return NextResponse.json(
        { error: `Invalid segment index: ${segmentIndex}` },
        { status: 400 }
      );
    }

    // Convert new price to USD if needed
    let convertedPrice = parseFloat(newPrice);
    if (currency !== "USD") {
      const response = await fetch(
        `https://1zukmeixgi.execute-api.ap-south-1.amazonaws.com/v1/currencies/convert?from=${currency}&to=USD&amount=${newPrice}`
      );
      if (!response.ok) throw new Error("Currency conversion failed");
      const {conversion} = await response.json();
      convertedPrice = parseFloat(conversion.result.toFixed(2));
    }

    // Calculate new total in USD using reduce
    const updatedSegments = [...booking.segments];
    updatedSegments[segmentIndex].selectedFleet.price = convertedPrice;
    const totalAmountUSD = updatedSegments.reduce(
      (acc, segment) => acc + parseFloat(segment.selectedFleet.price),
      0
    );

    // Convert total to booking currency
    const response = await fetch(
      `https://1zukmeixgi.execute-api.ap-south-1.amazonaws.com/v1/currencies/convert?from=USD&to=${booking.currency}&amount=${totalAmountUSD}`
    );
    if (!response.ok) throw new Error("Currency conversion failed");
    const { conversion } = await response.json();
    const totalAmountInBookingCurrency = parseFloat(conversion.result.toFixed(2));

    // Single update operation
    const updateResult = await Booking.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          [`segments.${segmentIndex}.selectedFleet.price`]: convertedPrice.toString(),
          amount_paid: totalAmountInBookingCurrency,
        },
      }
    );

    if (updateResult.matchedCount === 0) {
      return NextResponse.json(
        { error: `No booking found with id: ${id}` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: `Successfully updated price for segment ${segmentIndex}`,
      updatedPrice: convertedPrice,
      totalAmount: totalAmountInBookingCurrency,
    });
  } catch (err) {
    console.error("POST error:", err.message);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
};
