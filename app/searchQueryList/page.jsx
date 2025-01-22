"use client";
import React, { useState, useEffect } from "react";

const QueriesTable = () => {
  // State
  const [queryList, setQueryList] = useState([]);       // Will hold an array of query objects
  const [isLoading, setIsLoading] = useState(true);
  const [viewMoreModalOpen, setViewMoreModalOpen] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState(null); // The entire query object for the modal

  useEffect(() => {
    fetchQueries();
  }, []);

  // Fetch from /api/query
  const fetchQueries = async () => {
    try {
      const response = await fetch("/api/query");
      const data = await response.json();

      // If /api/query returns a single object, uncomment below line to wrap in an array:
      // const dataArray = Array.isArray(data) ? data : [data];

      setQueryList(Array.isArray(data) ? data : [data]); // handle array or single
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching query data:", error);
      setIsLoading(false);
    }
  };

  // Build an array of “rows” for the table: each segment becomes its own row.
  // This way we can show from/to/passengers/date/time on a single row, 
  // but still link back to the entire query for "View More."
  const rows = [];
  queryList.forEach((query) => {
    const { id, segments } = query;
    if (!segments || segments.length === 0) {
      // If no segments, still push a single row with placeholders
      rows.push({
        query,
        segmentIndex: -1, // means none
        rowData: {
          id,
          from: "N/A",
          to: "N/A",
          passengers: "-",
          departureDate: "-",
          departureTime: "-",
        },
      });
    } else {
      segments.forEach((segment, idx) => {
        rows.push({
          query,
          segmentIndex: idx,
          rowData: {
            id,
            from: segment.from,
            to: segment.to,
            passengers: segment.passengers,
            departureDate: segment.departureDate,
            departureTime: segment.departureTime,
          },
        });
      });
    }
  });

  return (
    <div className="flex-1 p-6 bg-gray-900 text-white min-h-screen">
      <h2 className="text-3xl font-semibold mb-6">Query List</h2>

      {isLoading ? (
        <p className="text-center">Loading query data...</p>
      ) : (
        <div className="bg-gray-800 rounded-lg shadow-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-700 text-white">
                <th className="px-4 py-3 border">S.No</th>
                <th className="px-4 py-3 border">ID</th>
                <th className="px-4 py-3 border">From</th>
                <th className="px-4 py-3 border">To</th>
                <th className="px-4 py-3 border">Passengers</th>
                <th className="px-4 py-3 border">Departure Date/Time</th>
                <th className="px-4 py-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.length > 0 ? (
                rows.map((item, index) => {
                  const {
                    id,
                    from,
                    to,
                    passengers,
                    departureDate,
                    departureTime,
                  } = item.rowData;

                  return (
                    <tr
                      key={`${id}-${index}`}
                      className="border-t border-gray-700 hover:bg-gray-700"
                    >
                      <td className="px-4 py-3 border">{index + 1}</td>
                      <td className="px-4 py-3 border">{id}</td>
                      <td className="px-4 py-3 border">{from}</td>
                      <td className="px-4 py-3 border">{to}</td>
                      <td className="px-4 py-3 border">{passengers}</td>
                      <td className="px-4 py-3 border">
                        {departureDate} {departureTime && `@ ${departureTime}`}
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
                  <td colSpan="7" className="text-center py-4 text-gray-400">
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
                      <th className="px-4 py-2 border">#</th>
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
