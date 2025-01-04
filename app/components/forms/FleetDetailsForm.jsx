"use client";
import React, { useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import AirportsSelect from "../../components/AirportSelect";
import FleetSelect from "../../components/FleetSelect";
import Link from "next/link";

const FleetDetailsForm = () => {
  const [formData, setFormData] = useState({
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
  });

  const [selectedCountry, setSelectedCountry] = useState("");
  const [permittedAirports, setPermittedAirports] = useState([]);
  const [restrictedAirports, setRestrictedAirports] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedModel, setSelectedModel] = useState("None");

  const handleChange = (e) => {
    const { name, value, type, files, options } = e.target;

    if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
    } else if (e.target.multiple) {
      const values = Array.from(options)
        .filter((option) => option.selected)
        .map((option) => option.value);
      setFormData({ ...formData, [name]: values });
    } else {
      setFormData({ ...formData, [name]: value });
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
          <FleetSelect
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        </fieldset>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {renderInput("Fleet Registration No", "registrationNo")}
          {renderInput("Fleet Registration Date", "registrationDate", "date")}
          {renderInput("Fleet Max Speed", "maxSpeed", "text", "Enter the Max Speed")}
          {renderInput("Pricing (Per / Hr)", "pricing", "text")}
          {renderSelect(
            "NonStop Flying Range",
            "flyingRange",
            ["upto 200 Knots", "200 - 400 Knots", "400 - 600 Knots"]
          )}
          {renderInput("Fleet MFG Date", "mfgDate", "date")}
          {renderInput("Insurance Expiry Date", "insuranceExpiry", "date")}
          {renderInput("Refurbished Date", "refurbishedDate", "date")}
          {renderInput("Last Maintenance Date", "lastMaintenance", "date")}
          {renderInput("Takeoff Runway (in Feet)", "takeoffRunway")}
          {renderInput("Landing Runway (in Feet)", "landingRunway")}
        </div>

        <fieldset className="border border-gray-200 rounded-2xl p-6 shadow-md bg-gradient-to-br from-gray-50 to-gray-100">
          <legend className="text-xl font-semibold px-4">
            Airport Permissions & Restrictions
          </legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AirportsSelect
              type="permitted"
              selectedAirports={permittedAirports}
              setSelectedAirports={setPermittedAirports}
              selectedCountry={selectedCountry}
              setSelectedCountry={setSelectedCountry}
            />
            <AirportsSelect
              type="restricted"
              selectedAirports={restrictedAirports}
              setSelectedAirports={setRestrictedAirports}
              selectedCountry={selectedCountry}
            />
          </div>
        </fieldset>

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
          </div>
        </div>
      </form>

      <div className="flex justify-between mt-16">
        <Link
          href="/fleetRegistration/imageGallery"
          className="px-8 py-3 rounded-lg bg-gradient-to-r from-green-400 to-green-500 text-white font-semibold shadow-lg hover:scale-110 transition-transform"
        >
          Next
        </Link>
      </div>
    </div>
  );
};

const renderInput = (label, name, type = "text", placeholder = "") => (
  <div>
    <label className="block text-lg font-medium mb-2">{label}</label>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      className="w-full border border-gray-300 p-4 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
    />
  </div>
);

const renderSelect = (label, name, options) => (
  <div>
    <label className="block text-lg font-medium mb-2">{label}</label>
    <select
      name={name}
      className="w-full border border-gray-300 p-4 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
    >
      {options.map((option, idx) => (
        <option key={idx}>{option}</option>
      ))}
    </select>
  </div>
);

export default FleetDetailsForm;
