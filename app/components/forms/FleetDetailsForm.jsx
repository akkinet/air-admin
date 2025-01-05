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
    permittedAirports: [],
    restrictedAirports: [],
    documents: null,
    takeoffRunway: "",
    landingRunway: "",
    selectedModel: "",  // Ensure this key exists by default
  };
  const [uploadedFileName, setUploadedFileName] = useState(null);

  useEffect(() => {
    const savedData = sessionStorage.getItem("formData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      updateFormData("fleetDetails", parsedData.fleetDetails);
    }
  }, []);



  // State for local selections that may not require direct sync initially
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedModel, setSelectedModel] = useState("None");

  const handleChange = (e) => {
    const { name, value, type, files, options } = e.target;
    let updatedValue = value;

    if (type === "file") {
      const file = files[0];
      updatedValue = file;

      if (file) {
        setUploadedFileName(file.name);  // Store file name in state
      }
    } else if (e.target.multiple) {
      updatedValue = Array.from(options)
        .filter((option) => option.selected)
        .map((option) => option.value);
    }

    updateFormData("fleetDetails", {
      ...fleetDetails,
      [name]: updatedValue,
    });
  };


  // Handle airport changes for permitted and restricted selections
  const handleAirportChange = (type, airports) => {
    if (type === "permitted") {
      updateFormData("fleetDetails", {
        ...fleetDetails,
        permittedAirports: airports,
      });
    } else if (type === "restricted") {
      updateFormData("fleetDetails", {
        ...fleetDetails,
        restrictedAirports: airports,
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-8 bg-white shadow-2xl rounded-2xl border border-gray-100">
      <h1 className="text-5xl font-extrabold text-center mb-12 bg-gradient-to-r from-indigo-500 to-purple-500 text-transparent bg-clip-text">
        Fleet Details Form
      </h1>

      <form className="space-y-12">
        <fieldset className="border border-gray-200 rounded-2xl p-6 shadow-md bg-gradient-to-br from-gray-50 to-gray-100">
          <legend className="text-xl font-semibold px-4">
            Category & Model Selection
          </legend>
          <ModelSelect
            selectedModel={fleetDetails.selectedModel || selectedModel}
            setSelectedModel={(value) =>
              updateFormData("fleetDetails", {
                ...fleetDetails,
                selectedModel: value,
              })
            }
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        </fieldset>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {renderInput("Fleet Registration No", "registrationNo", fleetDetails, handleChange)}
          {renderInput("Fleet Registration Date", "registrationDate", fleetDetails, handleChange, "date")}
          {renderInput("Fleet Max Speed", "maxSpeed", fleetDetails, handleChange, "text", "Enter the Max Speed")}
          {renderInput("Pricing (Per / Hr)", "pricing", fleetDetails, handleChange)}
          {renderSelect(
            "NonStop Flying Range",
            "flyingRange",
            fleetDetails,
            handleChange,
            ["upto 200 Knots", "200 - 400 Knots", "400 - 600 Knots"]
          )}
          {renderInput("Fleet MFG Date", "mfgDate", fleetDetails, handleChange, "date")}
          {renderInput("Insurance Expiry Date", "insuranceExpiry", fleetDetails, handleChange, "date")}
          {renderInput("Refurbished Date", "refurbishedDate", fleetDetails, handleChange, "date")}
          {renderInput("Last Maintenance Date", "lastMaintenance", fleetDetails, handleChange, "date")}
          {renderInput("Takeoff Runway (in Feet)", "takeoffRunway", fleetDetails, handleChange)}
          {renderInput("Landing Runway (in Feet)", "landingRunway", fleetDetails, handleChange)}
        </div>

        {/* Airport Permissions & Restrictions */}
        <fieldset className="border border-gray-200 rounded-2xl p-6 shadow-md bg-gradient-to-br from-gray-50 to-gray-100">
          <legend className="text-xl font-semibold px-4">
            Airport Permissions & Restrictions
          </legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AirportsSelect
              type="permitted"
              selectedAirports={fleetDetails.permittedAirports || []}
              setSelectedAirports={(airports) => handleAirportChange("permitted", airports)}
              selectedCountry={selectedCountry}
              setSelectedCountry={setSelectedCountry}
            />
            <AirportsSelect
              type="restricted"
              selectedAirports={fleetDetails.restrictedAirports || []}
              setSelectedAirports={(airports) => handleAirportChange("restricted", airports)}
              selectedCountry={selectedCountry}
            />
          </div>
        </fieldset>

        {/* Document Upload */}
        <div className="col-span-2 text-center">
          <label className="block text-lg font-medium">
            Upload Documents (License / Registration)
          </label>
          <div className="border-dashed border-2 border-gray-300 p-10 rounded-xl shadow-md bg-gray-50 hover:border-indigo-500 hover:bg-indigo-50 transition-all cursor-pointer">
            <FaCloudUploadAlt size={50} className="mx-auto text-gray-400" />
            <input
              type="file"
              name="documents"
              className="hidden"
              id="fileUpload"
              onChange={handleChange}
            />
            <label
              htmlFor="fileUpload"
              className="inline-block bg-blue-500 text-white px-6 py-2 rounded-lg mt-4 cursor-pointer hover:bg-blue-600 transition-all"
            >
              Upload File
            </label>
            {uploadedFileName && (
              <p className="text-green-600 mt-4">
                File uploaded: <span className="font-semibold">{uploadedFileName}</span>
              </p>
            )}

          </div>
        </div>
      </form>

      <div className="flex justify-between mt-16">
        <Link
          href="/fleetRegistration/imageGallery"
          onClick={() => {
            updateFormData("fleetDetails", fleetDetails);
            sessionStorage.setItem("formData", JSON.stringify({ fleetDetails }));
          }}

          className="px-8 py-3 rounded-lg bg-gradient-to-r from-green-400 to-green-500 text-white font-semibold shadow-lg hover:scale-110 transition-transform"
        >
          Next
        </Link>
        {/* <button
          type="button"
          onClick={() => {
            updateFormData("fleetDetails", fleetDetails);
            sessionStorage.setItem("formData", JSON.stringify({ fleetDetails }));
          }}
          className="px-8 py-3 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition-all"
        >
          Save Fleet Details
        </button> */}


      </div>
    </div>
  );
};

// Reusable Inputs with Context Integration
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

export default FleetDetailsForm;
