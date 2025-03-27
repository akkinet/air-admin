"use client";
import React, { useState, useEffect } from "react";
import { useFormContext } from "../../context/FormContext";
import VendorThankYouPage from "../ThankyouPage";
import Link from "next/link";

// A small helper to detect if a value is a URL (naive check)
function isUrl(value) {
  if (typeof value !== "string") return false;
  return value.startsWith("http://") || value.startsWith("https://");
}

function TravelModeCard({ modeName, modeDetails }) {
  const [isOpen, setIsOpen] = useState(true);

  // Recursively render any nested data
  function renderNestedData(data, indentLevel = 0) {
    if (typeof data !== "object" || data === null) {
      // Base case: if it's a simple value, just display
      return <span>{data}</span>;
    }
    return (
      <div className="ml-4">
        {Object.entries(data).map(([key, val]) => (
          <div key={key} className="my-1">
            <span className="font-medium mr-1">{key}:</span>
            {typeof val === "object" && val !== null ? (
              // Recurse
              <div className="ml-4 border-l pl-2 border-gray-300">
                {renderNestedData(val, indentLevel + 1)}
              </div>
            ) : (
              <span>{val}</span>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg shadow-sm mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 bg-gray-100 flex items-center justify-between text-left"
      >
        <span className="font-semibold text-lg capitalize">
          {modeName.replace(/_/g, " ")}
        </span>
        <span className="text-sm text-indigo-600">
          {isOpen ? "Hide" : "Show"}
        </span>
      </button>

      {isOpen && (
        <div className="p-4">
          {Object.keys(modeDetails).length === 0 ? (
            <p className="italic text-gray-500">
              No details available for this mode.
            </p>
          ) : (
            <div>
              {Object.entries(modeDetails).map(([topKey, nested]) => (
                <div key={topKey} className="border-b pb-2 mb-2">
                  <h4 className="font-medium capitalize mb-1">{topKey}</h4>
                  {renderNestedData(nested)}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function PreviewPage() {
  const { formData, updateFormData } = useFormContext();
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const savedData = sessionStorage.getItem("formData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      updateFormData("fleetDetails", parsedData.fleetDetails);
      updateFormData("aircraftGallery", parsedData.aircraftGallery);
      updateFormData("travelModes", parsedData.travelModes);
      updateFormData("additionalAmenities", parsedData.additionalAmenities);
    }
  }, []);

  const handleSubmit = () => {
    sessionStorage.removeItem("formData"); 
    console.log("Form Submitted Data:", formData);
    alert("Form submitted successfully!");
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return <VendorThankYouPage />;
  }

  const { fleetDetails, aircraftGallery, travelModes, additionalAmenities } = formData || {};

  return (
    <div className="container mx-auto py-12 px-6 max-w-6xl">
      <h1 className="text-4xl font-bold text-center mb-12">Preview Your Submission</h1>

      {/* Fleet Details */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Fleet Details</h2>
        {fleetDetails && Object.keys(fleetDetails).length > 0 ? (
          <table className="w-full border-collapse">
            <tbody>
              {Object.entries(fleetDetails).map(([key, value]) => {
                let displayValue;

                // Special handling
                if (key === "restrictedAirports" && Array.isArray(value)) {
                  displayValue =
                    value.length > 0
                      ? value
                          .map(
                            (airport) =>
                              `${airport.name} (${airport.iata_code}, ${airport.icao_code})`
                          )
                          .join(", ")
                      : "None";
                } else if (key === "documents" && isUrl(value)) {
                  displayValue = (
                    <a
                      href={value}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline"
                    >
                      {value}
                    </a>
                  );
                } else if (key === "logo" && isUrl(value)) {
                  displayValue = (
                    <img
                      src={value}
                      alt="Company Logo"
                      className="w-32 h-auto rounded border"
                    />
                  );
                } else if (typeof value === "object" && value !== null) {
                  displayValue = JSON.stringify(value);
                } else {
                  displayValue = value || "N/A";
                }

                return (
                  <tr key={key} className="border-b">
                    <td className="py-2 pr-4 font-medium capitalize w-1/3">
                      {key.replace(/_/g, " ")}:
                    </td>
                    <td className="py-2">{displayValue}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p className="italic text-gray-500">No fleet details available.</p>
        )}
      </div>

      {/* Aircraft Gallery */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Aircraft Gallery</h2>
        {aircraftGallery && Object.keys(aircraftGallery).length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(aircraftGallery).map(([section, images]) => {
              if (section === "video") {
                return (
                  <div
                    key="aircraft-video"
                    className="border rounded-xl overflow-hidden shadow-md"
                  >
                    <video
                      src={aircraftGallery.video}
                      controls
                      className="w-full h-64 object-cover"
                    />
                    <div className="p-4">
                      <p className="text-lg font-semibold">Aircraft Video</p>
                    </div>
                  </div>
                );
              }
              if (!images || typeof images !== "object") return null;
              return Object.entries(images).map(([view, url]) => (
                <div
                  key={`${section}-${view}`}
                  className="border rounded-xl overflow-hidden shadow-md"
                >
                  {url ? (
                    <img
                      src={url}
                      alt={`${section} - ${view}`}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                      No Image
                    </div>
                  )}
                  <div className="p-4">
                    <p className="text-lg font-semibold capitalize">
                      {section.replace(/_/g, " ")} - {view}
                    </p>
                  </div>
                </div>
              ));
            })}
          </div>
        ) : (
          <p className="italic text-gray-500">No images or video available in the gallery.</p>
        )}
      </div>

      {/* Travel Modes Section */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Selected Travel Modes</h2>
        {travelModes && Object.keys(travelModes).length > 0 ? (
          Object.entries(travelModes).map(([mode, details]) => (
            <TravelModeCard key={mode} modeName={mode} modeDetails={details} />
          ))
        ) : (
          <p className="italic text-gray-500">No travel modes selected.</p>
        )}
      </div>

      {/* Additional Amenities Section */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Additional Amenities</h2>
        {additionalAmenities && Object.keys(additionalAmenities).length > 0 ? (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-2 text-left border">Service</th>
                <th className="py-2 px-2 text-left border">Status</th>
                <th className="py-2 px-2 text-left border">Name</th>
                <th className="py-2 px-2 text-left border">Phone</th>
                <th className="py-2 px-2 text-left border">Email</th>
                <th className="py-2 px-2 text-left border">Address</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(additionalAmenities).map(([serviceName, data]) => {
                const { value, name, phone, email, address } = data;
                return (
                  <tr key={serviceName} className="border-b">
                    <td className="py-2 px-2 capitalize">{serviceName}</td>
                    <td className="py-2 px-2">{value}</td>
                    <td className="py-2 px-2">{name || "-"}</td>
                    <td className="py-2 px-2">{phone || "-"}</td>
                    <td className="py-2 px-2">{email || "-"}</td>
                    <td className="py-2 px-2">{address || "-"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p className="italic text-gray-500">No additional amenities selected.</p>
        )}
      </div>

      {/* Button Section */}
      <div className="flex justify-between mt-8">
        <Link
          href={"/fleetRegistration/addonServices"}
          className="px-8 py-3 rounded-lg bg-gradient-to-r from-red-400 to-red-500 text-white font-semibold shadow-lg hover:scale-105 transition-transform"
        >
          Back
        </Link>
        <button
          onClick={handleSubmit}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg transition duration-200"
        >
          Confirm and Submit
        </button>
      </div>
    </div>
  );
}
