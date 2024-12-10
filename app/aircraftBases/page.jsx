"use client";
import React, { useState } from "react";

const AircraftBases = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("view"); // "view" or "edit"
  const [selectedAircraft, setSelectedAircraft] = useState(null);
  const [aircraftList, setAircraftList] = useState([
    {
      base: "Birla Gliding Club",
      city: "Pilani",
      region: "IN-RJ",
      country: "India",
      iataCode: null,
      status: "Inactive",
    },
    {
      base: "Aster Helipad, Kochi",
      city: "Cochin",
      region: "KL-IN",
      country: "India",
      iataCode: null,
      status: "Active",
    },
    {
      base: "Anaa Airport",
      city: "Anaa",
      region: "PF-U-A",
      country: "French Polynesia",
      iataCode: "AAA",
      status: "Active",
    },
    {
      base: "Arrabury Airport",
      city: "Tanbar",
      region: "AU-QLD",
      country: "Australia",
      iataCode: "AAB",
      status: "Active",
    },
    {
      base: "El Arish International Airport",
      city: "El Arish",
      region: "EG-SIN",
      country: "Egypt",
      iataCode: "AAC",
      status: "Active",
    },
    {
      base: "Adado Airport",
      city: "Adado",
      region: "SO-GA",
      country: "Somalia",
      iataCode: "AAD",
      status: "InActive",
    },
    {
      base: "Annaba Rabah Bitat Airport",
      city: "Annaba",
      region: "DZ-23",
      country: "Algeria",
      iataCode: "AAE",
      status: "InActive",
    },
    {
      base: "Apalachicola Regional Airport",
      city: "Apalachicolaa",
      region: "US-FL",
      country: "USA - United States Of America",
      iataCode: "AAF",
      status: "Active",
    },
  ]);

  const handleSave = () => {
    setAircraftList((prev) =>
      prev.map((aircraft) =>
        aircraft.base === selectedAircraft.base ? selectedAircraft : aircraft
      )
    );
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    setAircraftList((prev) =>
      prev.filter((aircraft) => aircraft.base !== selectedAircraft.base)
    );
    setIsDeleteModalOpen(false);
    setSelectedAircraft(null);
  };

  return (
    <div className="flex-1">
      {/* Content */}
      <main className="p-6 bg-gray-900 text-white">
        {/* Header Section */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-semibold">List of Existing Aircraft Bases</h2>
          <button
            className="px-4 py-2 bg-green-500 text-white font-bold rounded"
            onClick={() => {
              setSelectedAircraft({
                base: "",
                city: "",
                region: "",
                country: "",
                iataCode: "",
                status: "Active",
                continent: "",
                icaoCode: "",
                latitude: "",
                longitude: "",
                tags: "",
              });
              setModalMode("add");
              setIsModalOpen(true);
            }}
          >
            + Add Aircraft Base
          </button>

        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search Aircraft Base..."
            className="w-full px-4 py-2 border rounded bg-gray-700 text-white focus:outline-none focus:ring focus:border-blue-500"
          />
        </div>

        {/* Aircraft Table */}
        <div className="bg-gray-800 rounded-lg shadow-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-700 text-white">
                <th className="px-4 py-3 border">AIRCRAFT BASE</th>
                <th className="px-4 py-3 border">CITY</th>
                <th className="px-4 py-3 border">REGION</th>
                <th className="px-4 py-3 border">COUNTRY</th>
                <th className="px-4 py-3 border">IATA CODE</th>
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
                  <td className="px-4 py-3 border">{aircraft.base}</td>
                  <td className="px-4 py-3 border">{aircraft.city}</td>
                  <td className="px-4 py-3 border">{aircraft.region}</td>
                  <td className="px-4 py-3 border">{aircraft.country}</td>
                  <td className="px-4 py-3 border">{aircraft.iataCode || "N/A"}</td>
                  <td className="px-4 py-3 border">
                    <span
                      className={`inline-block px-3 py-1 rounded text-white text-sm ${aircraft.status === "Active"
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
                        setSelectedAircraft({ ...aircraft });
                        setModalMode("view");
                        setIsModalOpen(true);
                      }}
                    >
                      View
                    </button>
                    <button
                      className="px-2 py-1 bg-yellow-500 rounded text-white text-sm"
                      onClick={() => {
                        setSelectedAircraft({ ...aircraft });
                        setModalMode("edit");
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
                {modalMode === "edit" ? "Edit Aircraft Base" : "View Aircraft Base"}
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
                if (modalMode === "add") {
                  setAircraftList((prev) => [...prev, selectedAircraft]);
                } else if (modalMode === "edit") {
                  handleSave();
                }
                setIsModalOpen(false);
              }}

            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white">Aircraft Base</label>
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
                    disabled={modalMode === "view"}
                  />
                </div>
                <div>
                  <label className="block text-white">City</label>
                  <input
                    type="text"
                    value={selectedAircraft.city || ""}
                    onChange={(e) =>
                      setSelectedAircraft({
                        ...selectedAircraft,
                        city: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded"
                    disabled={modalMode === "view"}
                  />
                </div>
                <div>
                  <label className="block text-white">Region</label>
                  <input
                    type="text"
                    value={selectedAircraft.region || ""}
                    onChange={(e) =>
                      setSelectedAircraft({
                        ...selectedAircraft,
                        region: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded"
                    disabled={modalMode === "view"}
                  />
                </div>
                <div>
                  <label className="block text-white">Country</label>
                  <input
                    type="text"
                    value={selectedAircraft.country || ""}
                    onChange={(e) =>
                      setSelectedAircraft({
                        ...selectedAircraft,
                        country: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded"
                    disabled={modalMode === "view"}
                  />
                </div>
                <div>
                  <label className="block text-white">IATA Code</label>
                  <input
                    type="text"
                    value={selectedAircraft.iataCode || ""}
                    onChange={(e) =>
                      setSelectedAircraft({
                        ...selectedAircraft,
                        iataCode: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded"
                    disabled={modalMode === "view"}
                  />
                </div>
                <div>
                  <label className="block text-white">Status</label>
                  <select
                    value={selectedAircraft.status || "Active"}
                    onChange={(e) =>
                      setSelectedAircraft({
                        ...selectedAircraft,
                        status: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded"
                    disabled={modalMode === "view"}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white">Continent</label>
                  <input
                    type="text"
                    value={selectedAircraft.continent || ""}
                    onChange={(e) =>
                      setSelectedAircraft({
                        ...selectedAircraft,
                        continent: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded"
                    disabled={modalMode === "view"}
                  />
                </div>
                <div>
                  <label className="block text-white">ICAO Code</label>
                  <input
                    type="text"
                    value={selectedAircraft.icaoCode || ""}
                    onChange={(e) =>
                      setSelectedAircraft({
                        ...selectedAircraft,
                        icaoCode: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded"
                    disabled={modalMode === "view"}
                  />
                </div>
                <div>
                  <label className="block text-white">Latitude</label>
                  <input
                    type="text"
                    value={selectedAircraft.latitude || ""}
                    onChange={(e) =>
                      setSelectedAircraft({
                        ...selectedAircraft,
                        latitude: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded"
                    disabled={modalMode === "view"}
                  />
                </div>
                <div>
                  <label className="block text-white">Longitude</label>
                  <input
                    type="text"
                    value={selectedAircraft.longitude || ""}
                    onChange={(e) =>
                      setSelectedAircraft({
                        ...selectedAircraft,
                        longitude: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded"
                    disabled={modalMode === "view"}
                  />
                </div>
                <div>
                  <label className="block text-white">Tags</label>
                  <input
                    type="text"
                    value={selectedAircraft.tags || ""}
                    onChange={(e) =>
                      setSelectedAircraft({
                        ...selectedAircraft,
                        tags: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded"
                    disabled={modalMode === "view"}
                  />
                </div>

              </div>
              {modalMode === "edit" && (
                <button
                  type="submit"
                  className="mt-4 px-4 py-2 bg-green-500 text-white font-bold rounded"
                >
                  Save Changes
                </button>
              )}
              {modalMode === "add" && (
                <button
                  type="submit"
                  className="mt-4 px-4 py-2 bg-purple-500 text-white font-bold rounded"
                >
                  Submit
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
              Are you sure you want to delete this aircraft base?
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

export default AircraftBases;
