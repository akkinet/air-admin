"use client";
import React, { useState, useEffect } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import AirportsSelect from "../../components/AirportSelect";
import ModelSelect from "../../components/FleetSelect";
import Link from "next/link";
import { useFormContext } from "../../context/FormContext";

const FleetDetailsForm = () => {
  const { formData, updateFormData } = useFormContext();
  
  const fleetDetails = formData.fleetDetails || {
    registrationNo: "",
    registrationDate: "",
    maxSpeed: "",
    flyingRange: "upto 200 Knots",
    mfgDate: "",
    pricing: "",
    insuranceExpiry: "",
    refurbishedDate: "",
    lastMaintenance: "",
    restrictedAirports: [],
    documents: null,
    takeoffRunway: "",
    landingRunway: "",
    seatCapacity: "", // ✅ New Seat Capacity field
    selectedModel: "",  
    selectedCategory: "", // ✅ Store selected category
    isFleetUnavailable: "no",
    unavailabilityDates: {
      fromDate: "",
      toDate: "",
    },
  };

  const [uploadedFileName, setUploadedFileName] = useState(null);

  useEffect(() => {
    const savedData = sessionStorage.getItem("formData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      updateFormData("fleetDetails", parsedData.fleetDetails);
    }
  }, []);

  const [selectedCategory, setSelectedCategory] = useState(fleetDetails.selectedCategory || "");
  const [selectedModel, setSelectedModel] = useState(fleetDetails.selectedModel || "");
  const [isFleetUnavailable, setIsFleetUnavailable] = useState(fleetDetails.isFleetUnavailable || "no");
  const [unavailabilityDates, setUnavailabilityDates] = useState(fleetDetails.unavailabilityDates || { fromDate: "", toDate: "" });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    let updatedValue = value;

    if (type === "file") {
      const file = files[0];
      updatedValue = file;
      if (file) {
        setUploadedFileName(file.name);
      }
    }

    updateFormData("fleetDetails", {
      ...fleetDetails,
      [name]: updatedValue,
    });
  };

  const handleUnavailabilityChange = (e) => {
    const value = e.target.value;
    setIsFleetUnavailable(value);

    const updatedFleetDetails = {
      ...fleetDetails,
      isFleetUnavailable: value,
      unavailabilityDates: value === "no" ? { fromDate: "", toDate: "" } : fleetDetails.unavailabilityDates,
    };

    updateFormData("fleetDetails", updatedFleetDetails);
    sessionStorage.setItem("formData", JSON.stringify({ fleetDetails: updatedFleetDetails }));
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    const updatedDates = { ...unavailabilityDates, [name]: value };

    setUnavailabilityDates(updatedDates);

    const updatedFleetDetails = { ...fleetDetails, unavailabilityDates: updatedDates };

    updateFormData("fleetDetails", updatedFleetDetails);
    sessionStorage.setItem("formData", JSON.stringify({ fleetDetails: updatedFleetDetails }));
  };

  // Reusable function to render input fields
const renderInput = (label, name, formData, handleChange, type = "text", placeholder = "") => (
  <div>
    <label className="block text-lg font-medium mb-2">{label}</label>
    <input
      type={type}
      name={name}
      value={formData[name] || ""}
      placeholder={placeholder}
      onChange={handleChange}
      className="w-full border border-gray-300 p-4 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
    />
  </div>
);

// Reusable function to render select dropdowns
const renderSelect = (label, name, formData, handleChange, options) => (
  <div>
    <label className="block text-lg font-medium mb-2">{label}</label>
    <select
      name={name}
      value={formData[name] || ""}
      onChange={handleChange}
      className="w-full border border-gray-300 p-4 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
    >
      {options.map((option, idx) => (
        <option key={idx} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);


  return (
    <div className="max-w-5xl mx-auto py-12 px-8 bg-white shadow-2xl rounded-2xl border border-gray-100">
      <h1 className="text-5xl font-extrabold text-center mb-12 bg-gradient-to-r from-indigo-500 to-purple-500 text-transparent bg-clip-text">
        Fleet Details Form
      </h1>

      <form className="space-y-12">
        {/* Category & Model Selection */}
        <fieldset className="border border-gray-200 rounded-2xl p-6 shadow-md bg-gradient-to-br from-gray-50 to-gray-100">
          <legend className="text-xl font-semibold px-4">Category & Model Selection</legend>
          <ModelSelect
            selectedModel={selectedModel}
            setSelectedModel={(value) => {
              setSelectedModel(value);
              updateFormData("fleetDetails", { ...fleetDetails, selectedModel: value });
            }}
            selectedCategory={selectedCategory}
            setSelectedCategory={(value) => {
              setSelectedCategory(value);
              updateFormData("fleetDetails", { ...fleetDetails, selectedCategory: value });
            }}
          />
        </fieldset>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {renderInput("Fleet Registration No", "registrationNo", fleetDetails, handleChange)}
          {renderInput("Fleet Registration Date", "registrationDate", fleetDetails, handleChange, "date")}
          {renderInput("Fleet Max Speed", "maxSpeed", fleetDetails, handleChange)}
          {renderInput("Pricing (Per / Hr)", "pricing", fleetDetails, handleChange)}
          {renderSelect("NonStop Flying Range", "flyingRange", fleetDetails, handleChange, ["upto 200 Knots", "200 - 400 Knots", "400 - 600 Knots"])}
          {renderInput("Fleet MFG Date", "mfgDate", fleetDetails, handleChange, "date")}
          {renderInput("Insurance Expiry Date", "insuranceExpiry", fleetDetails, handleChange, "date")}
          {renderInput("Refurbished Date", "refurbishedDate", fleetDetails, handleChange, "date")}
          {renderInput("Last Maintenance Date", "lastMaintenance", fleetDetails, handleChange, "date")}
          {renderInput("Takeoff Runway (in Feet)", "takeoffRunway", fleetDetails, handleChange)}
          {renderInput("Landing Runway (in Feet)", "landingRunway", fleetDetails, handleChange)}
          {renderInput("Seat Capacity", "seatCapacity", fleetDetails, handleChange, "number")} {/* ✅ Seat Capacity Field */}
        </div>

        {/* Non-availability of Fleet */}
        <fieldset className="border border-gray-200 rounded-2xl p-6 shadow-md bg-gradient-to-br from-gray-50 to-gray-100">
          <legend className="text-xl font-semibold px-4">Non-availability of Fleet</legend>
          <div className="flex items-center space-x-8 mt-4">
            <label className="flex items-center">
              <input type="radio" name="fleetUnavailable" value="yes" checked={isFleetUnavailable === "yes"} onChange={handleUnavailabilityChange} className="mr-2" /> Yes
            </label>
            <label className="flex items-center">
              <input type="radio" name="fleetUnavailable" value="no" checked={isFleetUnavailable === "no"} onChange={handleUnavailabilityChange} className="mr-2" /> No
            </label>
          </div>

          {isFleetUnavailable === "yes" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              {renderInput("From Date", "fromDate", unavailabilityDates, handleDateChange, "date")}
              {renderInput("To Date", "toDate", unavailabilityDates, handleDateChange, "date")}
            </div>
          )}
        </fieldset>

        <div className="flex justify-between mt-16">
          <Link href="/fleetRegistration/imageGallery"
            onClick={() => {
              const updatedFleetDetails = { ...fleetDetails, selectedCategory, selectedModel, isFleetUnavailable, unavailabilityDates };
              updateFormData("fleetDetails", updatedFleetDetails);
              sessionStorage.setItem("formData", JSON.stringify({ fleetDetails: updatedFleetDetails }));
            }}
            className="px-8 py-3 rounded-lg bg-gradient-to-r from-green-400 to-green-500 text-white font-semibold shadow-lg hover:scale-110 transition-transform"
          >
            Next
          </Link>
        </div>
      </form>
    </div>
  );
};

export default FleetDetailsForm;
