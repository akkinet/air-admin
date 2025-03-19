"use client";
import React, { useState, useEffect } from "react";

const Booking = () => {
  // State
  const [bookingList, setBookingList] = useState([]); // Will hold an array of booking objects
  const [isLoading, setIsLoading] = useState(true);

  const [viewMoreModalOpen, setViewMoreModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null); // The entire booking object for the modal

  // For search/filter
  const [searchTerm, setSearchTerm] = useState("");
  // For status filter (success or pending). Default is "success".
  const [statusFilter, setStatusFilter] = useState("success");

  // Helper function to format a number according to Indian numbering system
  const formatINR = (amount) => {
    if (!amount || isNaN(amount)) return amount;
    return Number(amount).toLocaleString("en-IN");
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Fetch from /api/booking
  const fetchBookings = async () => {
    try {
      const response = await fetch("/api/booking");
      const data = await response.json();
      // Handle array or single object response:
      const dataArray = Array.isArray(data) ? data : [data];

      setBookingList(dataArray);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching booking data:", error);
      setIsLoading(false);
    }
  };

  // Filter by status first, then by searchTerm (which can match _id, name, email, phone)
  const filteredBookings = bookingList
    // Filter by status
    .filter((booking) => booking.status === statusFilter)
    // Then filter by searchTerm
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
                <th className="px-4 py-3 border whitespace-nowrap">Name</th>
                <th className="px-4 py-3 border whitespace-nowrap">Email</th>
                <th className="px-4 py-3 border whitespace-nowrap">Phone</th>
                <th className="px-4 py-3 border whitespace-nowrap">Amount Paid</th>
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
                  <td colSpan="5" className="text-center py-4 text-gray-400">
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
              <h2 className="text-xl font-semibold text-white">Booking Details</h2>
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
                // We'll skip segments and user_info here to display them below
                if (key === "segments" || key === "user_info") return null;

                // Format total_amount if it exists
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
                          <td className="px-4 py-2 border">{seg.passengers}</td>
                          <td className="px-4 py-2 border">{seg.departureDate}</td>
                          <td className="px-4 py-2 border">{seg.departureTime}</td>
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
                              <th className="px-4 py-2 border">Registration No</th>
                              <th className="px-4 py-2 border">Type</th>
                              <th className="px-4 py-2 border">Model</th>
                              <th className="px-4 py-2 border">Seating Capacity</th>
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
                                {seg.selectedFleet.price}
                              </td>
                              <td className="px-4 py-2 border">
                                {seg.selectedFleet.time}
                              </td>
                            </tr>
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
                  {Object.entries(selectedBooking.user_info).map(([key, value]) => (
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
                  ))}
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
