import React from "react";
import FleetTable from "../components/FleetTable";
export default async function AircraftsPage() {
  const res = await fetch("http://localhost:3000/api/aircraft", { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to fetch fleets");
  }
  const fleets = await res.json();
  return (
    <main className="p-4 bg-gradient-to-r from-blue-50 to-indigo-100 min-h-screen">
      <FleetTable fleets={fleets} />
    </main>
  );
}
