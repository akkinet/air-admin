import { NextResponse } from 'next/server'
import db from "@/lib/mongodb";
import { ObjectId } from 'mongodb'  // Correct ObjectId import

export async function PUT(request, { params }) {
  const { id } = await params;

  try {
    const { segmentIdx, selectedFleetData } = await request.json();
    const Booking = db.collection("Booking");

    // Validate segment index type
    if (typeof segmentIdx !== 'number' || segmentIdx < 0) {
      return NextResponse.json(
        { message: 'Invalid segment index' },
        { status: 400 }
      );
    }

    const filter = { _id: new ObjectId(id) };

    // Check booking existence and validate segment index
    const booking = await Booking.findOne(filter);
    if (!booking) {
      return NextResponse.json(
        { message: 'Booking not found' },
        { status: 404 }
      );
    }

    if (segmentIdx >= booking.segments.length) {
      return NextResponse.json(
        { message: 'Segment index out of bounds' },
        { status: 400 }
      );
    }

    // Create new selectedFleet with generated ObjectId
    const newSelectedFleet = {
      ...selectedFleetData,
      _id: new ObjectId()  // Generate new MongoDB ObjectId
    };

    // Update operation using updateOne
    const updateResult = await Booking.updateOne(
      filter,
      { 
        $set: { 
          [`segments.${segmentIdx}.selectedFleet`]: newSelectedFleet 
        } 
      }
    );

    // Handle update failure
    if (updateResult.matchedCount === 0) {
      return NextResponse.json(
        { message: 'Booking not found' },
        { status: 404 }
      );
    }

    // Retrieve updated document
    const updatedBooking = await Booking.findOne(filter);

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}