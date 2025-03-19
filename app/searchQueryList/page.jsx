"use client";
import React, { useState, useEffect } from "react";

const QueriesTable = () => {
  // State
  const [queryList, setQueryList] = useState([]); // Will hold an array of query objects
  const [isLoading, setIsLoading] = useState(true);

  const [viewMoreModalOpen, setViewMoreModalOpen] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState(null); // The entire query object for the modal

  // For search/filter
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchQueries();
  }, []);

  // Fetch from /api/query
  const fetchQueries = async () => {
    try {
      const response = await fetch("/api/query");
      const data = await response.json();
      // Handle array or single object response:
      const dataArray = Array.isArray(data) ? data : [data];

      setQueryList(dataArray);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching query data:", error);
      setIsLoading(false);
    }
  };

  // Helper to extract text within parentheses:
  // If none found, returns the entire string as fallback.
  const extractCodeInParentheses = (str) => {
    if (typeof str !== "string") return str;
    const match = str.match(/\(([^)]+)\)/);
    return match ? match[1] : str;
  };

  // 1. Filter the queries based on searchTerm
  // 2. Sort them by timestamp descending (so latest is on top)
  const filteredQueries = queryList
    .sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
    .filter((query) => {
      const name = query.userInfo?.name?.toLowerCase() || "";
      const email = query.userInfo?.email?.toLowerCase() || "";
      const phone = query.userInfo?.phone?.toLowerCase() || "";
      const search = searchTerm.toLowerCase();

      return (
        name.includes(search) ||
        email.includes(search) ||
        phone.includes(search)
      );
    });

  // Build an array of “rows” for the table: each query becomes one row.
  const rows = [];
  filteredQueries.forEach((query) => {
    const { _id, segments, userInfo } = query;
    if (!segments || segments.length === 0) {
      rows.push({
        query,
        rowData: {
          _id,
          name: userInfo?.name || "N/A",
          email: userInfo?.email || "N/A",
          phone: userInfo?.phone || "N/A",
          from: "N/A",
          to: "N/A",
          departureDate: "-",
          departureTime: "-",
        },
      });
    } else {
      // Use the first segment for 'from' and the last segment for 'to'
      const firstSegment = segments[0];
      const lastSegment = segments[segments.length - 1];
      rows.push({
        query,
        rowData: {
          _id,
          name: userInfo?.name || "N/A",
          email: userInfo?.email || "N/A",
          phone: userInfo?.phone || "N/A",
          from: extractCodeInParentheses(firstSegment.from),
          to: extractCodeInParentheses(lastSegment.to),
          // Assuming departure date/time are taken from the first segment
          departureDate: firstSegment.departureDate,
          departureTime: firstSegment.departureTime,
        },
      });
    }
  });

  return (
    <div className="flex-1 p-6 bg-gray-900 text-white min-h-screen">
      <h2 className="text-3xl font-semibold mb-6">Search Query List</h2>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name, email or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 w-full md:w-1/2 bg-gray-800 text-white rounded focus:outline-none"
        />
      </div>

      {isLoading ? (
        <p className="text-center">Loading query data...</p>
      ) : (
        <div className="bg-gray-800 rounded-lg shadow-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-700 text-white">
                {/* Remove _id column from the table header if not needed */}
                <th className="px-4 py-3 border">Name</th>
                <th className="px-4 py-3 border">Email</th>
                <th className="px-4 py-3 border">Phone</th>
                <th className="px-4 py-3 border">From</th>
                <th className="px-4 py-3 border">To</th>
                <th className="px-4 py-3 border">Dept Date/Time</th>
                <th className="px-4 py-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.length > 0 ? (
                rows.map((item, index) => {
                  const {
                    _id,
                    name,
                    email,
                    phone,
                    from,
                    to,
                    departureDate,
                    departureTime,
                  } = item.rowData;

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
                      {/* Truncate "from" and "to" to a single line */}
                      <td className="px-4 py-3 border whitespace-nowrap overflow-ellipsis overflow-hidden max-w-[150px]">
                        {from}
                      </td>
                      <td className="px-4 py-3 border whitespace-nowrap overflow-ellipsis overflow-hidden max-w-[150px]">
                        {to}
                      </td>
                      <td className="px-4 py-3 border">
                        {departureDate}
                        {departureTime && ` @ ${departureTime}`}
                      </td>
                      <td className="px-4 py-3 border">
                        <button
                          className="px-3 py-1 bg-blue-500 text-white rounded"
                          onClick={() => {
                            setSelectedQuery(item.query); // entire query object
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
                  <td colSpan="8" className="text-center py-4 text-gray-400">
                    No queries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* View More Modal */}
      {viewMoreModalOpen && selectedQuery && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-3/4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">Query Details</h2>
              <button
                className="text-gray-400 hover:text-white"
                onClick={() => setViewMoreModalOpen(false)}
              >
                ✕
              </button>
            </div>

            {/* ID, tripType, timestamp, etc. */}
            <div className="grid grid-cols-2 gap-4">
              {/* We'll skip 'segments' and 'userInfo' here, so we can show them separately below */}
              {Object.entries(selectedQuery).map(([key, value]) => {
                if (key === "segments" || key === "userInfo") return null;
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
            {selectedQuery.segments && selectedQuery.segments.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Segments
                </h3>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-600 text-white">
                      <th className="px-4 py-2 border">Trip</th>
                      <th className="px-4 py-2 border">From</th>
                      <th className="px-4 py-2 border">To</th>
                      <th className="px-4 py-2 border">Passengers</th>
                      <th className="px-4 py-2 border">Departure Date</th>
                      <th className="px-4 py-2 border">Departure Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedQuery.segments.map((seg, idx) => (
                      <tr
                        key={idx}
                        className="border-t border-gray-500 hover:bg-gray-700"
                      >
                        <td className="px-4 py-2 border">{idx + 1}</td>
                        <td className="px-4 py-2 border">{seg.from}</td>
                        <td className="px-4 py-2 border">{seg.to}</td>
                        <td className="px-4 py-2 border">{seg.passengers}</td>
                        <td className="px-4 py-2 border">{seg.departureDate}</td>
                        <td className="px-4 py-2 border">{seg.departureTime}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* User Info Section */}
            {selectedQuery.userInfo && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-white mb-2">
                  User Info
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(selectedQuery.userInfo).map(([key, value]) => (
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

export default QueriesTable;
