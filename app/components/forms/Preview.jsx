"use client";
import React, { useState, useEffect } from "react";
import { useFormContext } from "../../context/FormContext";
import VendorThankYouPage from "../ThankyouPage";
import Link from "next/link";

const PreviewPage = () => {
  const { formData, updateFormData } = useFormContext();
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const savedData = sessionStorage.getItem("formData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      updateFormData("fleetDetails", parsedData.fleetDetails);
      updateFormData("aircraftGallery", parsedData.aircraftGallery);
      updateFormData("travelmodes", parsedData.travelModes);
      updateFormData("additionalAmenities", parsedData.additionalAmenities);
    }
  }, []);

  const handleSubmit = () => {
    sessionStorage.removeItem("formData"); // Clear form data from session storage
    console.log("Form Submitted Data:", formData);
    alert("Form submitted successfully!");
    setIsSubmitted(true); // Show Thank You Page
  };

  if (isSubmitted) {
    return <VendorThankYouPage />;
  }

  return (
    <div className="container mx-auto py-12 px-6">
      <h1 className="text-4xl font-bold text-center mb-12">Preview Your Submission</h1>
      
      {/* Fleet Details */}
      <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Fleet Details</h2>
        <div className="space-y-4">
          {formData?.fleetDetails && Object.keys(formData.fleetDetails).length > 0 ? (
            Object.entries(formData.fleetDetails).map(([key, value]) => {
              let displayValue;
              if (key === "documents" && value && value.name) {
                displayValue = value.name;
              } else if (key === "restrictedAirports" && Array.isArray(value)) {
                displayValue =
                  value.length > 0
                    ? value
                        .map(
                          (airport) =>
                            `${airport.name} (${airport.iata_code}, ${airport.icao_code})`
                        )
                        .join(", ")
                    : "None";
              } else if (typeof value === "object" && value !== null) {
                displayValue = Array.isArray(value)
                  ? value.join(", ")
                  : JSON.stringify(value);
              } else {
                displayValue = value;
              }
              return (
                <div key={key} className="flex justify-between border-b pb-2">
                  <span className="font-medium capitalize">
                    {key.replace(/_/g, " ")}:
                  </span>
                  <span>{displayValue}</span>
                </div>
              );
            })
          ) : (
            <p>No fleet details available.</p>
          )}
        </div>
      </div>
      
      {/* Aircraft Gallery */}
      <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Aircraft Gallery</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {formData?.aircraftGallery && Object.keys(formData.aircraftGallery).length > 0 ? (
            <>
              {Object.entries(formData.aircraftGallery).map(([section, images]) =>
                section !== "video" &&
                images &&
                Object.entries(images).map(([view, url]) => (
                  <div key={`${section}-${view}`} className="border rounded-xl overflow-hidden shadow-md">
                    <img
                      src={url}
                      alt={`${section} - ${view}`}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <p className="text-lg font-semibold">
                        {section.replace(/_/g, " ")} - {view}
                      </p>
                    </div>
                  </div>
                ))
              )}

              {/* Render Video Separately */}
              {formData.aircraftGallery.video && (
                <div className="border rounded-xl overflow-hidden shadow-md">
                  <video
                    src={formData.aircraftGallery.video}
                    controls
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-4">
                    <p className="text-lg font-semibold">Aircraft Video</p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <p>No images or video available in the gallery.</p>
          )}
        </div>
      </div>
      
      {/* Travel Modes Section */}
      <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Selected Travel Modes</h2>
        <div className="space-y-4">
          {formData?.travelmodes && Object.keys(formData.travelmodes).length > 0 ? (
            Object.entries(formData.travelmodes).map(([mode, details]) => (
              <div key={mode} className="border-b pb-4">
                <h3 className="text-xl font-medium capitalize">
                  {mode.replace(/_/g, " ")}
                </h3>
                <div className="mt-2 space-y-2">
                  {Object.entries(details).length > 0 ? (
                    Object.entries(details).map(([key, value]) => (
                      <div key={key} className="flex justify-between border-t pt-2">
                        <span className="capitalize">
                          {key.replace(/_/g, " ")}:
                        </span>
                        <span>
                          {typeof value === "object" ? (
                            Object.entries(value).map(([subKey, subValue]) => (
                              <div key={subKey} className="flex justify-between">
                                <span>{subKey} : </span>
                                <span>{subValue}</span>
                              </div>
                            ))
                          ) : (
                            value
                          )}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p>No details available for this mode.</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>No travel modes selected.</p>
          )}
        </div>
      </div>
      
      {/* Additional Amenities Section */}
      <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
          Additional Amenities
        </h2>
        <div className="space-y-4">
          {formData.additionalAmenities &&
          Object.keys(formData.additionalAmenities).length > 0 ? (
            Object.entries(formData.additionalAmenities).map(([key, value]) => (
              <div key={key} className="border-b pb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="capitalize font-medium">
                    {key.replace(/_/g, " ")}
                  </span>
                  <span className="font-semibold">{value.value}</span>
                </div>
                {(value.name || value.phone) && (
                  <div className="text-sm text-gray-600 space-y-1">
                    {value.name && (
                      <p>
                        <span className="font-semibold">Name:</span> {value.name}
                      </p>
                    )}
                    {value.phone && (
                      <p>
                        <span className="font-semibold">Phone:</span> {value.phone}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No additional amenities selected.</p>
          )}
        </div>
      </div>

      {/* Button Section */}
      <div className="flex justify-between mt-16">
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
};

export default PreviewPage;
