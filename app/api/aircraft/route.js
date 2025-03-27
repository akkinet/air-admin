import db from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const collection = db.collection("Aircraft");
    const aircraft = await collection.find({}).toArray();
    return new Response(JSON.stringify(aircraft), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching aircraft:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch aircraft" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const Aircraft = db.collection("Aircraft");
    const result = await Aircraft.insertOne(body);

    return NextResponse.json({ message: `flight ${result.insertedId} is added` });
  } catch (error) {
    console.error("Error fetching aircraft:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch aircraft" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
