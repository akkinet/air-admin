"use client";
import React, { useState } from "react";

const AircraftModels = () => {
  const [aircraftModelsData, setAircraftModelsData] = useState([]);
  return (
    <div className="p-6 bg-gray-900 text-white">
      <h2 className="text-2xl font-semibold mb-4">List of Existing Aircraft Models</h2>
      <div className="bg-gray-800 rounded-lg shadow-lg">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-700 text-white">
              <th className="px-4 py-3 border">AIRCRAFT MODEL</th>
              <th className="px-4 py-3 border">STATUS</th>
              <th className="px-4 py-3 border">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {aircraftModelsData.map((model) => (
              <tr key={model.id} className="border-t border-gray-700 hover:bg-gray-700">
                <td className="px-4 py-3 border">{model.name}</td>
                <td className="px-4 py-3 border">
                  <span
                    className={`inline-block px-3 py-1 rounded text-white text-sm ${
                      model.status === "Active" ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {model.status}
                  </span>
                </td>
                <td className="px-4 py-3 border flex space-x-2">
                  <button className="px-2 py-1 bg-blue-500 rounded text-white text-sm">
                    View
                  </button>
                  <button className="px-2 py-1 bg-yellow-500 rounded text-white text-sm">
                    Edit
                  </button>
                  <button className="px-2 py-1 bg-red-500 rounded text-white text-sm">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AircraftModels;