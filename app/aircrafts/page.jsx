"use client";
import React, { useState } from "react";

const Aircrafts = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAircraft, setSelectedAircraft] = useState(null);
  const [aircraftList, setAircraftList] = useState([
    {
      vendor: "Charter Flights Aviation (International)",
      regCallSign: "vt-cra",
      model: "Learjet 45XR",
      type: "Private Jet",
      base: "Los Angeles",
      seatMode: "PREES MODE",
      status: "Active",
    },
    {
      vendor: "Bibin Aviation",
      regCallSign: "bb 001",
      model: "Challenger 601",
      type: "Charter",
      base: "Adado Airport",
      seatMode: "MEDICAL MODE",
      status: "Inactive",
    },
    {
      vendor: "Charter Flights Aviation (International)",
      regCallSign: "CFA001",
      model: "Beechcraft King Air 200",
      type: "Air Ambulance",
      base: "Mumias Airport",
      seatMode: "SEAT / DAY MODE",
      status: "Active",
    },
    {
      vendor: "Charter Flights Aviation (International)",
      regCallSign: "CFA 001",
      model: "Agusta AW109 Grand",
      type: "Air Ambulance",
      base: "Nairobi",
      seatMode: "SEAT / DAY MODE",
      status: "Active",
    },
  ]);

  const handleDelete = () => {
    setAircraftList((prev) =>
      prev.filter((aircraft) => aircraft.regCallSign !== selectedAircraft.regCallSign)
    );
    setIsDeleteModalOpen(false);
    setSelectedAircraft(null);
  };

  return (
    <div className="flex-1 ">
      {/* Content */}
      <main className="p-6 bg-gray-900 text-white">
        {/* Header Section */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-semibold">List of Existing Vendor's Aircrafts</h2>
          <button className="px-4 py-2 bg-green-500 text-white font-bold rounded">
            + Add Aircraft
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search Aircraft..."
            className="w-full px-4 py-2 border rounded bg-gray-700 text-white focus:outline-none focus:ring focus:border-blue-500"
          />
        </div>

        {/* Aircraft Table */}
        <div className="bg-gray-800 rounded-lg shadow-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-700 text-white">
                <th className="px-4 py-3 border">VENDOR</th>
                <th className="px-4 py-3 border">REG CALL SIGN</th>
                <th className="px-4 py-3 border">MODEL</th>
                <th className="px-4 py-3 border">TYPE</th>
                <th className="px-4 py-3 border">BASE</th>
                <th className="px-4 py-3 border">SEAT MODE</th>
                <th className="px-4 py-3 border">STATUS</th>
                <th className="px-4 py-3 border">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {aircraftList.map((aircraft, index) => (
                <tr
                  key={index}
                  className="border-t border-gray-700 hover:bg-gray-700"
                >
                  <td className="px-4 py-3 border">{aircraft.vendor}</td>
                  <td className="px-4 py-3 border">{aircraft.regCallSign}</td>
                  <td className="px-4 py-3 border">{aircraft.model}</td>
                  <td className="px-4 py-3 border">{aircraft.type}</td>
                  <td className="px-4 py-3 border">{aircraft.base}</td>
                  <td className="px-4 py-3 border">{aircraft.seatMode}</td>
                  <td className="px-4 py-3 border">
                    <span
                      className={`inline-block px-3 py-1 rounded text-white text-sm ${
                        aircraft.status === "Active"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    >
                      {aircraft.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 border flex space-x-2">
                    <button
                      className="px-2 py-1 bg-blue-500 rounded text-white text-sm"
                      onClick={() => {
                        setSelectedAircraft({ ...aircraft, mode: "view" });
                        setIsModalOpen(true);
                      }}
                    >
                      View
                    </button>
                    <button
                      className="px-2 py-1 bg-yellow-500 rounded text-white text-sm"
                      onClick={() => {
                        setSelectedAircraft({ ...aircraft, mode: "edit" });
                        setIsModalOpen(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="px-2 py-1 bg-red-500 rounded text-white text-sm"
                      onClick={() => {
                        setSelectedAircraft(aircraft);
                        setIsDeleteModalOpen(true);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* View/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-3/4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">
                {selectedAircraft.mode === "edit" ? "Edit Aircraft" : "View Aircraft"}
              </h2>
              <button
                className="text-gray-400 hover:text-white"
                onClick={() => setIsModalOpen(false)}
              >
                ✕
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (selectedAircraft.mode === "edit") {
                  setAircraftList((prev) =>
                    prev.map((item) =>
                      item.regCallSign === selectedAircraft.regCallSign
                        ? { ...selectedAircraft }
                        : item
                    )
                  );
                }
                setIsModalOpen(false);
              }}
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white">Vendor</label>
                  <input
                    type="text"
                    value={selectedAircraft.vendor || ""}
                    onChange={(e) =>
                      setSelectedAircraft({
                        ...selectedAircraft,
                        vendor: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded"
                    disabled={selectedAircraft.mode === "view"}
                  />
                </div>
                <div>
                  <label className="block text-white">Reg Call Sign</label>
                  <input
                    type="text"
                    value={selectedAircraft.regCallSign || ""}
                    onChange={(e) =>
                      setSelectedAircraft({
                        ...selectedAircraft,
                        regCallSign: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded"
                    disabled={selectedAircraft.mode === "view"}
                  />
                </div>
                <div>
                  <label className="block text-white">Model</label>
                  <input
                    type="text"
                    value={selectedAircraft.model || ""}
                    onChange={(e) =>
                      setSelectedAircraft({
                        ...selectedAircraft,
                        model: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded"
                    disabled={selectedAircraft.mode === "view"}
                  />
                </div>
                <div>
                  <label className="block text-white">Type</label>
                  <input
                    type="text"
                    value={selectedAircraft.type || ""}
                    onChange={(e) =>
                      setSelectedAircraft({
                        ...selectedAircraft,
                        type: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded"
                    disabled={selectedAircraft.mode === "view"}
                  />
                </div>
                <div>
                  <label className="block text-white">Base</label>
                  <input
                    type="text"
                    value={selectedAircraft.base || ""}
                    onChange={(e) =>
                      setSelectedAircraft({
                        ...selectedAircraft,
                        base: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded"
                    disabled={selectedAircraft.mode === "view"}
                  />
                </div>
                <div>
                  <label className="block text-white">Seat Mode</label>
                  <input
                    type="text"
                    value={selectedAircraft.seatMode || ""}
                    onChange={(e) =>
                      setSelectedAircraft({
                        ...selectedAircraft,
                        seatMode: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded"
                    disabled={selectedAircraft.mode === "view"}
                  />
                </div>
              </div>
              {selectedAircraft.mode === "edit" && (
                <button
                  type="submit"
                  className="mt-4 px-4 py-2 bg-green-500 text-white font-bold rounded"
                >
                  Save Changes
                </button>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-semibold text-white mb-4">
              Are you sure you want to delete this aircraft?
            </h2>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-600 text-white rounded"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Aircrafts;
