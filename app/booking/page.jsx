"use client";
import React, { useState, useEffect } from "react";

const Booking = () => {
  // State
  const [bookingList, setBookingList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [viewMoreModalOpen, setViewMoreModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // For search/filter across all bookings
  const [searchTerm, setSearchTerm] = useState("");
  // For status filter (success or pending). Default is "success".
  const [statusFilter, setStatusFilter] = useState("success");

  // Holds the fetched available fleets for each segment: { [segmentIndex]: [arrayOfFleetsReturned] }
  const [availableFleets, setAvailableFleets] = useState({});
  // Loading state for each segment’s “Modify Fleet” fetch
  const [isSegmentLoading, setIsSegmentLoading] = useState({});

  // Per-segment search terms for available fleets
  const [fleetSearchTerm, setFleetSearchTerm] = useState({});

  // Helper function to format a number according to Indian numbering system
  const formatINR = (amount) => {
    if (!amount || isNaN(amount)) return amount;
    return Number(amount).toLocaleString("en-IN");
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Fetch from /api/booking (your internal endpoint)
  const fetchBookings = async () => {
    try {
      const response = await fetch("/api/booking");
      const data = await response.json();
      const dataArray = Array.isArray(data) ? data : [data];
      setBookingList(dataArray);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching booking data:", error);
      setIsLoading(false);
    }
  };

  // Clean up the string, e.g. "Dubai International Airport (DXB)" → "Dubai International Airport"
  const removeParentheses = (str = "") => {
    return str.split("(")[0].trim();
  };

  // Handle "Modify Fleet" button click
  const handleModifyFleet = async (segmentIndex) => {
    if (!selectedBooking || !selectedBooking.segments) return;

    const seg = selectedBooking.segments[segmentIndex];
    // Clean up "from" and "to"
    const from = removeParentheses(seg.from);
    const to = removeParentheses(seg.to);
    const date = seg.departureDate;
    const passengers = seg.passengers;

    // Set loading = true for this segment
    setIsSegmentLoading((prev) => ({ ...prev, [segmentIndex]: true }));

    try {
      const url = `https://www.airambulanceaviation.co.in/api/search-flights?from=${encodeURIComponent(
        from
      )}&to=${encodeURIComponent(to)}&departureDate=${encodeURIComponent(
        date
      )}&travelerCount=${encodeURIComponent(passengers)}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch available fleets.");
      }
      const data = await response.json();

      if (data && data.finalFleet) {
        setAvailableFleets((prev) => ({
          ...prev,
          [segmentIndex]: data.finalFleet,
        }));
      }
    } catch (error) {
      console.error("Error fetching available fleets:", error);
    } finally {
      // Turn off loading spinner
      setIsSegmentLoading((prev) => ({ ...prev, [segmentIndex]: false }));
    }
  };

  // Update the search term for a particular segment
  const handleFleetSearchChange = (segmentIndex, val) => {
    setFleetSearchTerm((prev) => ({
      ...prev,
      [segmentIndex]: val,
    }));
  };

  // Filter the fleets based on user input (reg no, _id, price)
  const filterFleets = (fleets, segmentIndex) => {
    const searchVal = (fleetSearchTerm[segmentIndex] || "").toLowerCase();
    if (!searchVal) return fleets; // no filtering if empty

    return fleets.filter((item) => {
      const { _id, fleetDetails } = item;
      const registrationNo = fleetDetails?.registrationNo || "";
      const price = fleetDetails?.pricing || "";

      return (
        _id?.toLowerCase().includes(searchVal) ||
        registrationNo?.toLowerCase().includes(searchVal) ||
        price?.toString().toLowerCase().includes(searchVal)
      );
    });
  };

  // Filter booking list by status, then by searchTerm
  const filteredBookings = bookingList
    .filter((booking) => booking.status === statusFilter)
    .filter((booking) => {
      const { _id, user_info } = booking;
      const name = user_info?.name?.toLowerCase() || "";
      const email = user_info?.email?.toLowerCase() || "";
      const phone = user_info?.phone?.toLowerCase() || "";
      const idString = _id?.toLowerCase() || "";
      const search = searchTerm.toLowerCase();

      return (
        name.includes(search) ||
        email.includes(search) ||
        phone.includes(search) ||
        idString.includes(search)
      );
    });

  return (
    <div className="flex-1 p-6 bg-gray-900 text-white min-h-screen">
      <h2 className="text-3xl font-semibold mb-6">Bookings</h2>

      {/* Search and Status Filter */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-4">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by name, email, phone, or _id..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 w-full md:w-1/2 bg-gray-800 text-white rounded focus:outline-none"
        />

        {/* Status Filter Buttons */}
        <div className="flex gap-2">
          <button
            className={`px-4 py-2 rounded font-semibold ${
              statusFilter === "success"
                ? "bg-green-600 text-white"
                : "bg-gray-700 text-gray-200"
            }`}
            onClick={() => setStatusFilter("success")}
          >
            Success
          </button>
          <button
            className={`px-4 py-2 rounded font-semibold ${
              statusFilter === "pending"
                ? "bg-green-600 text-white"
                : "bg-gray-700 text-gray-200"
            }`}
            onClick={() => setStatusFilter("pending")}
          >
            Pending
          </button>
        </div>
      </div>

      {isLoading ? (
        <p className="text-center">Loading booking data...</p>
      ) : (
        <div className="bg-gray-800 rounded-lg shadow-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-700 text-white">
                <th className="px-4 py-3 border whitespace-nowrap">Sr No.</th>
                <th className="px-4 py-3 border whitespace-nowrap">Name</th>
                <th className="px-4 py-3 border whitespace-nowrap">Email</th>
                <th className="px-4 py-3 border whitespace-nowrap">Phone</th>
                <th className="px-4 py-3 border whitespace-nowrap">
                  Amount Paid
                </th>
                <th className="px-4 py-3 border whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking, index) => {
                  const { _id, amount_paid, user_info } = booking;
                  const name = user_info?.name || "N/A";
                  const email = user_info?.email || "N/A";
                  const phone = user_info?.phone || "N/A";

                  return (
                    <tr
                      key={`${_id}-${index}`}
                      className="border-t border-gray-700 hover:bg-gray-700"
                    >
                      <td className="px-4 py-3 border whitespace-nowrap">
                        {_id}
                      </td>
                      <td className="px-4 py-3 border whitespace-nowrap">
                        {name}
                      </td>
                      <td className="px-4 py-3 border whitespace-nowrap">
                        {email}
                      </td>
                      <td className="px-4 py-3 border whitespace-nowrap">
                        {phone}
                      </td>
                      <td className="px-4 py-3 border whitespace-nowrap">
                        {formatINR(amount_paid)}
                      </td>
                      <td className="px-4 py-3 border">
                        <button
                          className="px-3 py-1 bg-blue-500 text-white rounded"
                          onClick={() => {
                            setSelectedBooking(booking);
                            setViewMoreModalOpen(true);
                            setAvailableFleets({});
                            setIsSegmentLoading({});
                          }}
                        >
                          View More
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-400">
                    No bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* View More Modal */}
      {viewMoreModalOpen && selectedBooking && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-3/4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">
                Booking Details
              </h2>
              <button
                className="text-gray-400 hover:text-white"
                onClick={() => setViewMoreModalOpen(false)}
              >
                ✕
              </button>
            </div>

            {/* Main Booking Details (excluding segments and user_info) */}
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(selectedBooking).map(([key, value]) => {
                if (key === "segments" || key === "user_info") return null;

                if (key === "total_amount" && !isNaN(value)) {
                  return (
                    <div key={key}>
                      <label className="block text-white font-semibold">
                        {key}
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={formatINR(value)}
                        className="w-full px-4 py-2 bg-gray-700 text-white rounded"
                      />
                    </div>
                  );
                }

                return (
                  <div key={key}>
                    <label className="block text-white font-semibold">
                      {key}
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={
                        typeof value === "object"
                          ? JSON.stringify(value, null, 2)
                          : String(value)
                      }
                      className="w-full px-4 py-2 bg-gray-700 text-white rounded"
                    />
                  </div>
                );
              })}
            </div>

            {/* Segments Section */}
            {selectedBooking.segments && selectedBooking.segments.length > 0 && (
              <div className="mt-8 space-y-6">
                <h3 className="text-lg font-semibold text-white">Segments</h3>
                {selectedBooking.segments.map((seg, idx) => (
                  <fieldset
                    key={idx}
                    className="border border-gray-600 rounded-md p-4"
                  >
                    <legend className="px-2 text-white font-semibold">
                      Segment {idx + 1}
                    </legend>

                    {/* Segment Table */}
                    <table className="w-full text-left border-collapse bg-gray-700 rounded overflow-hidden mt-4">
                      <thead>
                        <tr className="bg-gray-600 text-white">
                          <th className="px-4 py-2 border">From</th>
                          <th className="px-4 py-2 border">To</th>
                          <th className="px-4 py-2 border">Passengers</th>
                          <th className="px-4 py-2 border">Departure Date</th>
                          <th className="px-4 py-2 border">Departure Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-t border-gray-500 hover:bg-gray-600">
                          <td className="px-4 py-2 border">{seg.from}</td>
                          <td className="px-4 py-2 border">{seg.to}</td>
                          <td className="px-4 py-2 border">
                            {seg.passengers}
                          </td>
                          <td className="px-4 py-2 border">
                            {seg.departureDate}
                          </td>
                          <td className="px-4 py-2 border">
                            {seg.departureTime}
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    {/* Fleet Table (if selectedFleet exists) */}
                    {seg.selectedFleet && (
                      <div className="mt-4">
                        <h5 className="text-white font-semibold mb-2">
                          Selected Fleet
                        </h5>
                        <table className="w-full text-left border-collapse bg-gray-700 rounded overflow-hidden">
                          <thead>
                            <tr className="bg-gray-600 text-white">
                              <th className="px-4 py-2 border">
                                Registration No
                              </th>
                              <th className="px-4 py-2 border">Type</th>
                              <th className="px-4 py-2 border">Model</th>
                              <th className="px-4 py-2 border">Seats</th>
                              <th className="px-4 py-2 border">Price</th>
                              <th className="px-4 py-2 border">Time</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-t border-gray-500 hover:bg-gray-600">
                              <td className="px-4 py-2 border">
                                {seg.selectedFleet.registrationNo}
                              </td>
                              <td className="px-4 py-2 border">
                                {seg.selectedFleet.type}
                              </td>
                              <td className="px-4 py-2 border">
                                {seg.selectedFleet.model}
                              </td>
                              <td className="px-4 py-2 border">
                                {seg.selectedFleet.seatingCapacity}
                              </td>
                              <td className="px-4 py-2 border">
                                $ {seg.selectedFleet.price}
                              </td>
                              <td className="px-4 py-2 border">
                                {seg.selectedFleet.time}
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        {/* Modify Fleet Button */}
                        <div className="mt-4">
                          <button
                            className="px-3 py-1 bg-blue-500 text-white rounded flex items-center gap-2"
                            onClick={() => handleModifyFleet(idx)}
                            disabled={!!isSegmentLoading[idx]}
                          >
                            {isSegmentLoading[idx]
                              ? (
                                <>
                                  <svg
                                    className="animate-spin h-4 w-4 text-white"
                                    viewBox="0 0 24 24"
                                  >
                                    <circle
                                      className="opacity-25"
                                      cx="12"
                                      cy="12"
                                      r="10"
                                      stroke="currentColor"
                                      strokeWidth="4"
                                      fill="none"
                                    ></circle>
                                    <path
                                      className="opacity-75"
                                      fill="currentColor"
                                      d="M4 12a8 8 0 018-8v4l3-5-3-5v4a12 12 0 00-12 12h4z"
                                    ></path>
                                  </svg>
                                  Searching Fleet...
                                </>
                              )
                              : "Modify Fleet"}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Available Fleets Table (if any) */}
                    {availableFleets[idx] && availableFleets[idx].length > 0 && (
                      <div className="mt-4">
                        {/* Heading + search bar */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
                          <h5 className="text-white font-semibold mb-2 md:mb-0">
                            Available Fleets ({availableFleets[idx].length})
                          </h5>
                          <input
                            type="text"
                            placeholder="Search by ID, Reg No, or Price"
                            className="px-3 py-1 bg-gray-700 text-white rounded"
                            value={fleetSearchTerm[idx] || ""}
                            onChange={(e) =>
                              handleFleetSearchChange(idx, e.target.value)
                            }
                          />
                        </div>

                        {/* Filter the fleets by search term */}
                        <table className="w-full text-left border-collapse bg-gray-700 rounded overflow-hidden">
                          <thead>
                            <tr className="bg-gray-600 text-white">
                              <th className="px-4 py-2 border">S. No</th>
                              <th className="px-4 py-2 border">_id</th>
                              <th className="px-4 py-2 border">
                                Registration No
                              </th>
                              <th className="px-4 py-2 border">Type</th>
                              <th className="px-4 py-2 border">Model</th>
                              <th className="px-4 py-2 border">Seats</th>
                              <th className="px-4 py-2 border">Price</th>
                              <th className="px-4 py-2 border">Time</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filterFleets(availableFleets[idx], idx).map(
                              (fleetItem, i) => {
                                const { _id, flightTime, fleetDetails } =
                                  fleetItem;
                                return (
                                  <tr
                                    key={_id || i}
                                    className="border-t border-gray-500 hover:bg-gray-600"
                                  >
                                    <td className="px-4 py-2 border">
                                      {i + 1}
                                    </td>
                                    <td className="px-4 py-2 border">
                                      {_id || "N/A"}
                                    </td>
                                    <td className="px-4 py-2 border">
                                      {fleetDetails?.registrationNo || "N/A"}
                                    </td>
                                    <td className="px-4 py-2 border">
                                      {fleetDetails?.flightType || "N/A"}
                                    </td>
                                    <td className="px-4 py-2 border">
                                      {fleetDetails?.selectedModel || "N/A"}
                                    </td>
                                    <td className="px-4 py-2 border">
                                      {fleetDetails?.seatCapacity || "N/A"}
                                    </td>
                                    <td className="px-4 py-2 border">
                                      {fleetDetails?.pricing
                                        ? `$ ${fleetDetails.pricing}`
                                        : "N/A"}
                                    </td>
                                    <td className="px-4 py-2 border">
                                      {flightTime || "N/A"}
                                    </td>
                                  </tr>
                                );
                              }
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </fieldset>
                ))}
              </div>
            )}

            {/* User Info Section */}
            {selectedBooking.user_info && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-white mb-2">
                  User Info
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(selectedBooking.user_info).map(
                    ([key, value]) => (
                      <div key={key}>
                        <label className="block text-white font-semibold">
                          {key}
                        </label>
                        <input
                          type="text"
                          readOnly
                          value={
                            typeof value === "object"
                              ? JSON.stringify(value, null, 2)
                              : String(value)
                          }
                          className="w-full px-4 py-2 bg-gray-700 text-white rounded"
                        />
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Close Button */}
            <div className="flex justify-end mt-6">
              <button
                className="px-4 py-2 bg-red-500 text-white font-bold rounded"
                onClick={() => setViewMoreModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Booking;
