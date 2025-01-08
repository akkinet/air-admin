"use client";
import React, { useState, useEffect } from "react";

const VendorsTable = () => {
  const [vendorList, setVendorList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVendor, setSelectedVendor] = useState(null);  // Track selected vendor for approval
  const [isModalOpen, setIsModalOpen] = useState(false);  // Modal state
  const [isViewMoreModalOpen, setIsViewMoreModalOpen] = useState(false);
  const [viewVendorDetails, setViewVendorDetails] = useState(null);


  useEffect(() => {
    fetchVendorData();
  }, []);

  const fetchVendorData = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/vendor");
      const data = await response.json();
      setVendorList(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching vendor data:", error);
      setIsLoading(false);
    }
  };

  const handleApproveVendor = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/vendor/${selectedVendor.ID}?verified=true`,
        {
          method: "PUT",
        }
      );
      if (response.ok) {
        alert("Vendor approved successfully!");
        fetchVendorData();  // Refresh vendor list after approval
        setIsModalOpen(false);  // Close modal
      } else {
        alert("Failed to approve vendor.");
      }
    } catch (error) {
      console.error("Error approving vendor:", error);
    }
  };

  return (
    <div className="flex-1 p-6 bg-gray-900 text-white min-h-screen">
      <h2 className="text-3xl font-semibold mb-6">Vendor List</h2>

      {isLoading ? (
        <p className="text-center">Loading vendor data...</p>
      ) : (
        <div className="bg-gray-800 rounded-lg shadow-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-700 text-white">
                <th className="px-4 py-3 border">S.No</th>
                <th className="px-4 py-3 border">ID</th>
                <th className="px-4 py-3 border">Corporate Name</th>
                <th className="px-4 py-3 border">Full Name</th>
                <th className="px-4 py-3 border">Phone</th>
                <th className="px-4 py-3 border">City</th>
                <th className="px-4 py-3 border">Verified</th>
                <th className="px-4 py-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vendorList.length > 0 ? (
                vendorList.map((vendor, index) => (
                  <tr
                    key={vendor.ID}
                    className="border-t border-gray-700 hover:bg-gray-700"
                  >
                    <td className="px-4 py-3 border">{index + 1}</td>
                    <td className="px-4 py-3 border">{vendor.ID}</td>
                    <td className="px-4 py-3 border">{vendor.corporateName}</td>
                    <td className="px-4 py-3 border">
                      {vendor.firstName} {vendor.lastName}
                    </td>
                    <td className="px-4 py-3 border">{vendor.phone}</td>
                    <td className="px-4 py-3 border">{vendor.city}</td>
                    <td className="px-4 py-3 border">
                      <span
                        className={`px-2 py-1 rounded cursor-pointer ${vendor.verified
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                          }`}
                        onClick={() => {
                          if (!vendor.verified) {
                            setSelectedVendor(vendor);  // Set selected vendor
                            setIsModalOpen(true);  // Open modal
                          }
                        }}
                      >
                        {vendor.verified ? "Verified" : "Not Verified"}
                      </span>
                    </td>
                    <td className="px-4 py-3 border">
                      <button
                        className="px-3 py-1 bg-blue-500 text-white rounded"
                        onClick={() => {
                          setViewVendorDetails(vendor);
                          setIsViewMoreModalOpen(true);
                        }}

                      >
                        View More
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-gray-400">
                    No vendors found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Approval Modal */}
      {isModalOpen && selectedVendor && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-semibold text-white mb-4">
              Approve Vendor
            </h2>
            <p className="text-white mb-6">
              Please review the vendor details carefully before approving.
              Approving unauthorized vendors can have serious consequences.
            </p>
            <div className="mb-4">
              <p>
                <strong>Name:</strong> {selectedVendor.firstName}{" "}
                {selectedVendor.lastName}
              </p>
              <p>
                <strong>Corporate Name:</strong>{" "}
                {selectedVendor.corporateName}
              </p>
              <p>
                <strong>City:</strong> {selectedVendor.city}
              </p>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-600 text-white rounded"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded"
                onClick={handleApproveVendor}
              >
                Approve Vendor
              </button>
            </div>
          </div>
        </div>
      )}

{isViewMoreModalOpen && viewVendorDetails && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-3/4 max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">Vendor Details</h2>
        <button
          className="text-gray-400 hover:text-white"
          onClick={() => setIsViewMoreModalOpen(false)}
        >
          ✕
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {Object.entries(viewVendorDetails).map(([key, value]) => {
          if (key === "socialLinks" || key === "branches") return null;  // Skip for now to show separately
          return (
            <div key={key}>
              <label className="block text-white">{key}</label>
              <input
                type="text"
                value={
                  typeof value === "object" ? JSON.stringify(value, null, 2) : value
                }
                readOnly
                className="w-full px-4 py-2 bg-gray-700 text-white rounded"
              />
            </div>
          );
        })}
      </div>

      {/* Social Links Section */}
      {viewVendorDetails.socialLinks && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-white mb-4">
            Social Links
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {viewVendorDetails.socialLinks.map((link, index) => (
              <div key={index} className="flex flex-col">
                <label className="text-white">{link.type}</label>
                <a
                  href={link.value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 underline truncate"
                >
                  {link.value}
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Branches Section */}
      {viewVendorDetails.branches && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-white mb-4">Branches</h3>
          {viewVendorDetails.branches.map((branch, index) => (
            <div key={index} className="mb-6 p-4 bg-gray-700 rounded-lg">
              <h4 className="text-md font-medium text-white">
                {branch.departmentName}
              </h4>
              <div className="grid grid-cols-2 gap-4 mt-2">
                {Object.entries(branch).map(([key, value]) => {
                  if (key === "socialLinks") return null;  // Handle separately
                  return (
                    <div key={key}>
                      <label className="block text-white">{key}</label>
                      <input
                        type="text"
                        value={
                          typeof value === "object"
                            ? JSON.stringify(value, null, 2)
                            : value
                        }
                        readOnly
                        className="w-full px-4 py-2 bg-gray-600 text-white rounded"
                      />
                    </div>
                  );
                })}
              </div>

              {/* Branch Social Links Table */}
              {branch.socialLinks && (
                <div className="mt-4">
                  <h5 className="text-md font-semibold text-white mb-2">
                    Branch Social Links
                  </h5>
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-600 text-white">
                        <th className="px-4 py-2 border">Type</th>
                        <th className="px-4 py-2 border">Link</th>
                      </tr>
                    </thead>
                    <tbody>
                      {branch.socialLinks.map((link, i) => (
                        <tr key={i} className="border-t border-gray-500">
                          <td className="px-4 py-2 border">{link.type}</td>
                          <td className="px-4 py-2 border">
                            <a
                              href={link.value}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 underline"
                            >
                              {link.value}
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-end mt-6">
        <button
          className="px-4 py-2 bg-red-500 text-white font-bold rounded"
          onClick={() => setIsViewMoreModalOpen(false)}
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

export default VendorsTable;
