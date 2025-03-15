"use client";

import React, { useState } from "react";

const FleetTable = ({ fleets }) => {
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Search state
  const [searchTerm, setSearchTerm] = useState("");

  // States for details modals
  const [selectedFleet, setSelectedFleet] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // For the fullscreen image modal
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState("");

  // Handle search
  const handleSearch = (e) => {
    const { value } = e.target;
    setSearchTerm(value.toLowerCase());
    setCurrentPage(1); // reset to first page when searching
  };

  // Filter fleets by Fleet ID or vendor email
  const filteredFleets = fleets.filter((fleet) => {
    const fleetId = fleet._id?.toLowerCase() || "";
    const vendorEmail = fleet.fleetDetails.vendor_email?.toLowerCase() || "";
    return (
      fleetId.includes(searchTerm) || vendorEmail.includes(searchTerm)
    );
  });

  // Calculate pagination
  const totalFiltered = filteredFleets.length;
  const totalPages = Math.ceil(totalFiltered / itemsPerPage);

  // Get items for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const fleetsToDisplay = filteredFleets.slice(startIndex, endIndex);

  // Pagination handlers
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  // Modal handlers
  const handleViewMore = (fleet) => {
    setSelectedFleet(fleet);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedFleet(null);
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden p-6">
      {/* --- Search & Count Bar --- */}
      <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center mb-6">
        <div className="flex items-center gap-2">
          <label htmlFor="search" className="font-medium text-gray-700">
            Search:
          </label>
          <input
            id="search"
            type="text"
            placeholder="Search by Fleet ID or Vendor Email"
            value={searchTerm}
            onChange={handleSearch}
            className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring"
          />
        </div>

        <div className="text-gray-700 font-medium">
          Total Aircrafts: <span className="font-bold">{fleets.length}</span>
        </div>
      </div>

      {/* --- Fleet Table Listing --- */}
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-indigo-600 text-white">
          <tr>
            <th className="px-4 py-2">Serial No</th>
            <th className="px-4 py-2">Fleet ID</th>
            <th className="px-4 py-2">Vendor Email</th>
            <th className="px-4 py-2">Model</th>
            <th className="px-4 py-2">Seats</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {fleetsToDisplay.map((fleet, index) => (
            <tr key={fleet._id} className="even:bg-gray-100 hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">
                {/* (startIndex) is the offset for items in previous pages */}
                {startIndex + index + 1}
              </td>
              <td className="border border-gray-300 px-4 py-2">{fleet._id}</td>
              <td className="border border-gray-300 px-4 py-2">
                {fleet.fleetDetails.vendor_email}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {fleet?.fleetDetails?.selectedModel}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {fleet?.fleetDetails?.seatCapacity}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                <button
                  onClick={() => handleViewMore(fleet)}
                  className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition"
                >
                  View More
                </button>
              </td>
            </tr>
          ))}

          {/* If no results after filtering */}
          {fleetsToDisplay.length === 0 && (
            <tr>
              <td
                colSpan="6"
                className="text-center py-4 text-gray-500 italic"
              >
                No matching fleets found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* --- Pagination Controls --- */}
      {totalFiltered > 0 && (
        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded font-medium ${
              currentPage === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            Previous
          </button>

          <div className="text-gray-700">
            Page <span className="font-bold">{currentPage}</span> of{" "}
            <span className="font-bold">{totalPages}</span>
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded font-medium ${
              currentPage === totalPages || totalPages === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            Next
          </button>
        </div>
      )}

      {/* --- MODAL: Fleet Details Preview --- */}
      {isModalOpen && selectedFleet && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-70 flex justify-center items-center p-4">
          <div className="relative bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-full overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white text-2xl bg-black bg-opacity-50 px-3 py-1 rounded-full hover:bg-opacity-75 transition"
            >
              &times;
            </button>

            {/* Fleet Details Heading */}
            <header className="bg-indigo-600 text-white p-6">
              <h1 className="text-3xl font-bold font-sans text-center">
                Fleet Details Preview
              </h1>
            </header>

            {/* Fleet Details Content */}
            <div className="p-8 space-y-8">
              {/* Basic Fleet Details */}
              <section>
                <h2 className="text-2xl font-semibold text-indigo-700 mb-4 border-b-2 border-indigo-300 pb-2">
                  Fleet Details
                </h2>
                <table className="w-full table-auto border-collapse border border-gray-200 text-gray-800">
                  <tbody>
                    {Object.entries(selectedFleet.fleetDetails).map(
                      ([key, value]) => {
                        if (
                          key === "restrictedAirports" ||
                          key === "unavailabilityDates"
                        ) {
                          // We handle these separately below
                          return null;
                        }
                        return (
                          <tr
                            key={key}
                            className="even:bg-gray-100 hover:bg-gray-50"
                          >
                            <td className="px-4 py-2 font-medium capitalize border-r border-gray-300">
                              {key.replace(/([A-Z])/g, " $1")}
                            </td>
                            <td className="px-4 py-2">
                              {typeof value === "object" && !Array.isArray(value)
                                ? Object.entries(value)
                                    .map(
                                      ([nestedKey, nestedValue]) =>
                                        `${nestedKey}: ${nestedValue}`
                                    )
                                    .join(", ")
                                : Array.isArray(value)
                                ? value.join(", ")
                                : value}
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              </section>

              {/* Restricted Airports */}
              {selectedFleet.fleetDetails?.restrictedAirports && (
                <section>
                  <h2 className="text-2xl font-semibold text-indigo-700 mb-4 border-b-2 border-indigo-300 pb-2">
                    Restricted Airports
                  </h2>
                  <ul className="list-disc list-inside text-gray-800 space-y-2">
                    {selectedFleet.fleetDetails.restrictedAirports.map(
                      (airport, index) => (
                        <li key={index}>{airport}</li>
                      )
                    )}
                  </ul>
                </section>
              )}

              {/* Unavailability Dates */}
              {selectedFleet.fleetDetails?.unavailabilityDates && (
                <section>
                  <h2 className="text-2xl font-semibold text-indigo-700 mb-4 border-b-2 border-indigo-300 pb-2">
                    Unavailability Dates
                  </h2>
                  <table className="w-full table-auto border-collapse border border-gray-200 text-gray-800">
                    <tbody>
                      <tr className="even:bg-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-2 font-medium capitalize border-r border-gray-300">
                          From
                        </td>
                        <td className="px-4 py-2">
                          {
                            selectedFleet.fleetDetails.unavailabilityDates
                              .fromDate
                          }
                        </td>
                      </tr>
                      <tr className="even:bg-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-2 font-medium capitalize border-r border-gray-300">
                          To
                        </td>
                        <td className="px-4 py-2">
                          {
                            selectedFleet.fleetDetails.unavailabilityDates
                              .toDate
                          }
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </section>
              )}

              {/* Aircraft Gallery */}
              {selectedFleet.aircraftGallery && (
                <section>
                  <h2 className="text-2xl font-semibold text-indigo-700 mb-4 border-b-2 border-indigo-300 pb-2">
                    Aircraft Gallery
                  </h2>
                  <div className="space-y-6">
                    {["cockpit", "exterior", "interior"].map((view) => (
                      <div key={view}>
                        <h3 className="text-xl font-semibold capitalize text-indigo-600 mb-2">
                          {view}
                        </h3>
                        <div className="flex space-x-4 overflow-x-auto">
                          {selectedFleet.aircraftGallery[view] &&
                            Object.entries(
                              selectedFleet.aircraftGallery[view]
                            ).map(([angle, url]) => (
                              <div
                                key={angle}
                                className="flex-shrink-0"
                              >
                                <h4 className="text-sm font-medium text-gray-600 mb-2">
                                  {angle}
                                </h4>
                                <img
                                  src={url}
                                  alt={`${view} ${angle}`}
                                  className="w-64 h-40 object-cover rounded-lg shadow-md hover:scale-105 transform transition duration-300 cursor-pointer"
                                  onClick={() => {
                                    setModalImageUrl(url);
                                    setIsImageModalOpen(true);
                                  }}
                                />
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}

                    {selectedFleet.aircraftGallery.video && (
                      <div>
                        <h3 className="text-xl font-semibold text-indigo-600 mb-2">
                          Video
                        </h3>
                        <video
                          controls
                          autoPlay
                          muted
                          loop
                          src={selectedFleet.aircraftGallery.video}
                          className="w-full h-96 rounded-lg shadow-md object-cover"
                        />
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Additional Amenities */}
              {selectedFleet.additionalAmenities && (
                <section>
                  <h2 className="text-2xl font-semibold text-indigo-700 mb-4 border-b-2 border-indigo-300 pb-2">
                    Additional Amenities
                  </h2>
                  <table className="w-full table-auto border-collapse border border-gray-200 text-gray-800">
                    <tbody>
                      {Object.entries(selectedFleet.additionalAmenities).map(
                        ([key, value]) => (
                          <tr
                            key={key}
                            className="even:bg-gray-100 hover:bg-gray-50"
                          >
                            <td className="px-4 py-2 font-medium capitalize border-r border-gray-300">
                              {key}
                            </td>
                            <td className="px-4 py-2">
                              <p>{value.value}</p>
                              {value.name && (
                                <p>
                                  <strong>Name:</strong> {value.name}
                                </p>
                              )}
                              {value.phone && (
                                <p>
                                  <strong>Phone:</strong> {value.phone}
                                </p>
                              )}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </section>
              )}

              {/* Travel Modes */}
              {selectedFleet.travelmodes && (
                <section>
                  <h2 className="text-2xl font-semibold text-indigo-700 mb-4 border-b-2 border-indigo-300 pb-2">
                    Travel Modes
                  </h2>
                  {Object.entries(selectedFleet.travelmodes).map(
                    ([mode, details]) => (
                      <div key={mode} className="mb-6">
                        <h3 className="text-xl font-semibold capitalize text-indigo-600">
                          {mode}
                        </h3>
                        <table className="w-full table-auto border-collapse border border-gray-200 text-gray-800">
                          <tbody>
                            {Object.entries(details).map(([key, value]) => (
                              <tr
                                key={key}
                                className="even:bg-gray-100 hover:bg-gray-50"
                              >
                                <td className="px-4 py-2 font-medium capitalize border-r border-gray-300">
                                  {key}
                                </td>
                                <td className="px-4 py-2">
                                  {typeof value === "object"
                                    ? Object.entries(value)
                                        .map(
                                          ([nestedKey, nestedValue]) =>
                                            `${nestedKey}: ${nestedValue}`
                                        )
                                        .join(", ")
                                    : value}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )
                  )}
                </section>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: Fullscreen Image View --- */}
      {isImageModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="relative">
            <img
              src={modalImageUrl}
              alt="Modal"
              className="w-auto h-auto max-w-3xl max-h-[90vh] rounded-lg shadow-lg"
            />
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="absolute top-4 right-4 text-white text-2xl bg-black bg-opacity-50 px-4 py-2 rounded-full hover:bg-opacity-75 transition"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FleetTable;
