import { NextResponse } from "next/server";
import db from "@/lib/mongodb";

export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const searchText = searchParams.get("query");
    console.log("search", searchText);

    const collection = db.collection("Airports");
    const result = await collection
      .aggregate([
        {
          $match: {
            $or: [
              { name: { $regex: searchText, $options: "i" } }, // Case-insensitive partial match for name
              { city: { $regex: searchText, $options: "i" } }, // Case-insensitive partial match for city
              { country: { $regex: searchText, $options: "i" } }, // Case-insensitive partial match for country
              { iata_code: { $regex: searchText, $options: "i" } }, // Case-insensitive partial match for iata_code
              { icao_code: { $regex: searchText, $options: "i" } }, // Case-insensitive partial match for icao_code
            ],
          },
        },
        {
          $addFields: {
            // Calculate a custom score for each document
            score: {
              $sum: [
                {
                  $cond: [
                    { $eq: [{ $toLower: "$name" }, searchText.toLowerCase()] },
                    10, // Highest score for exact match on name
                    0,
                  ],
                },
                {
                  $cond: [
                    { $eq: [{ $toLower: "$city" }, searchText.toLowerCase()] },
                    8, // Higher score for exact match on city
                    0,
                  ],
                },
                {
                  $cond: [
                    { $eq: [{ $toLower: "$country" }, searchText.toLowerCase()] },
                    6, // Higher score for exact match on country
                    0,
                  ],
                },
                {
                  $cond: [
                    { $eq: [{ $toLower: "$iata_code" }, searchText.toLowerCase()] },
                    4, // Higher score for exact match on iata_code
                    0,
                  ],
                },
                {
                  $cond: [
                    { $eq: [{ $toLower: "$icao_code" }, searchText.toLowerCase()] },
                    2, // Higher score for exact match on icao_code
                    0,
                  ],
                },
                {
                  $cond: [
                    { $regexMatch: { input: "$name", regex: searchText, options: "i" } },
                    1, // Lower score for partial match on name
                    0,
                  ],
                },
                {
                  $cond: [
                    { $regexMatch: { input: "$city", regex: searchText, options: "i" } },
                    1, // Lower score for partial match on city
                    0,
                  ],
                },
                {
                  $cond: [
                    { $regexMatch: { input: "$country", regex: searchText, options: "i" } },
                    1, // Lower score for partial match on country
                    0,
                  ],
                },
                {
                  $cond: [
                    { $regexMatch: { input: "$iata_code", regex: searchText, options: "i" } },
                    1, // Lower score for partial match on iata_code
                    0,
                  ],
                },
                {
                  $cond: [
                    { $regexMatch: { input: "$icao_code", regex: searchText, options: "i" } },
                    1, // Lower score for partial match on icao_code
                    0,
                  ],
                },
              ],
            },
          },
        },
        {
          $project: {
            name: 1,
            city: 1,
            country: 1,
            iata_code: 1,
            icao_code: 1,
            score: 1, // Include the custom score in the output
          },
        },
        {
          $sort: {
            score: -1, // Sort by score in descending order
          },
        },
      ])
      .toArray();

    return NextResponse.json(result);
  } catch (error) {
    console.error("error", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};