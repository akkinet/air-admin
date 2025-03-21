"use client";
import React, { useState, useEffect } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import ModelSelect from "../../components/FleetSelect";
import Link from "next/link";
import { useFormContext } from "../../context/FormContext";
import { useSession } from "next-auth/react";

const FleetDetailsForm = () => {
  const { formData, updateFormData } = useFormContext();
  const { data: session } = useSession();

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
    seatCapacity: "",
    selectedModel: "",
    flightType: "",
    unavailabilityDates: {
      fromDate: "",
      toDate: "",
    },
    luggage: "",
    vendor_email: "",
    permanentBaseStation: "",
    baseStation: "",
    logo: null,
    isFleetUnavailable: "no",
  };

  // Keep a local preview for the logo (optional)
  const [logoPreview, setLogoPreview] = useState(null);

  // For station searches
  const [baseStationQuery, setBaseStationQuery] = useState("");
  const [permanentBaseStationQuery, setPermanentBaseStation] = useState("");
  const [restrictedAirportQuery, setRestrictedAirportQuery] = useState("");

  const [baseStationSuggestions, setBaseStationSuggestions] = useState([]);
  const [permanentBaseStationSuggestions, setPermanentBaseStationSuggestions] = useState([]);
  const [restrictedAirportSuggestions, setRestrictedAirportSuggestions] = useState([]);

  // Keep track of category & model
  const [flightType, setflightType] = useState(fleetDetails.flightType || "");
  const [selectedModel, setSelectedModel] = useState(fleetDetails.selectedModel || "");

  // Non-availability
  const [isFleetUnavailable, setIsFleetUnavailable] = useState(
    fleetDetails.isFleetUnavailable || "no"
  );
  const [unavailabilityDates, setUnavailabilityDates] = useState({
    fromDate: fleetDetails.unavailabilityDates?.fromDate || "",
    toDate: fleetDetails.unavailabilityDates?.toDate || "",
  });

  // On mount, restore from sessionStorage if available
  useEffect(() => {
    const savedData = sessionStorage.getItem("formData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      if (parsedData?.fleetDetails) {
        updateFormData("fleetDetails", parsedData.fleetDetails);
      }
    }
  }, []);

  // Whenever session has vendor email, store it
  useEffect(() => {
    if (session?.user?.email) {
      updateFormData("fleetDetails", {
        ...fleetDetails,
        vendor_email: session.user.email,
      });
    }
  }, [session]);

  // Generic change handler for text inputs
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    let updatedValue = value;

    // We handle the actual file upload in specific functions (logo/docs),
    // so we skip it here if it's `type="file"`.
    if (type === "file") return;

    updateFleetDetailsField(name, updatedValue);
  };

  // Helper to update both state & sessionStorage
  const updateFleetDetailsField = (name, value) => {
    const updatedData = { ...fleetDetails, [name]: value };
    updateFormData("fleetDetails", updatedData);
    sessionStorage.setItem("formData", JSON.stringify({ fleetDetails: updatedData }));
  };

  // ========== LOGO UPLOAD ==========
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // For a quick in-page preview
    setLogoPreview(URL.createObjectURL(file));

    // Convert file -> Base64 -> POST fetch
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        // Strip out the prefix ("data:image/*;base64,")
        const base64Content = reader.result.split(",")[1];
        const response = await fetch(
          "https://3k5q9gfaak.execute-api.ap-south-1.amazonaws.com/v1/upload",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              directory: "Logos", // <--- directory for logo
              file: base64Content,
              filename: file.name,
              contentType: file.type,
            }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          // data.url should be the final S3 link
          updateFleetDetailsField("logo", data.url);
        } else {
          console.error("Logo upload error:", data.error || "Unknown error");
        }
      } catch (error) {
        console.error("Logo upload failed:", error);
      }
    };

    reader.readAsDataURL(file);
  };

  // ========== DOCUMENTS UPLOAD ==========
  const handleDocumentsChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64Content = reader.result.split(",")[1];

        // Make the POST request
        const response = await fetch(
          "https://3k5q9gfaak.execute-api.ap-south-1.amazonaws.com/v1/upload",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              directory: "Documents", // <--- directory for documents
              file: base64Content,
              filename: file.name,
              contentType: file.type,
            }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          // Store the returned URL in fleetDetails.documents
          updateFleetDetailsField("documents", data.url);
        } else {
          console.error("Documents upload error:", data.error || "Unknown error");
        }
      } catch (error) {
        console.error("Documents upload failed:", error);
      }
    };

    reader.readAsDataURL(file);
  };

  // Luggage capacity => append " kgs" on blur
  const handleLuggageBlur = () => {
    let val = fleetDetails.luggage || "";
    val = val.replace(/kgs/gi, "").trim();
    if (val) val += " kgs";
    updateFleetDetailsField("luggage", val);
  };

  // Non-availability radio
  const handleUnavailabilityChange = (e) => {
    const value = e.target.value;
    setIsFleetUnavailable(value);

    const newDates = value === "no" ? { fromDate: "", toDate: "" } : fleetDetails.unavailabilityDates;
    const updatedFleetDetails = {
      ...fleetDetails,
      isFleetUnavailable: value,
      unavailabilityDates: newDates,
    };

    updateFormData("fleetDetails", updatedFleetDetails);
    sessionStorage.setItem("formData", JSON.stringify({ fleetDetails: updatedFleetDetails }));
  };

  // fromDate/toDate changes
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    const updatedDates = { ...unavailabilityDates, [name]: value };
    setUnavailabilityDates(updatedDates);

    const updatedFleetDetails = {
      ...fleetDetails,
      unavailabilityDates: updatedDates,
    };
    updateFormData("fleetDetails", updatedFleetDetails);
    sessionStorage.setItem("formData", JSON.stringify({ fleetDetails: updatedFleetDetails }));
  };

  // Reusable function to render input fields
  const renderInput = (
    label,
    name,
    formDataObj,
    handleChangeFn,
    type = "text",
    placeholder = "",
    required = false
  ) => (
    <div>
      <label className="block text-lg font-medium mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={formDataObj[name] || ""}
        placeholder={placeholder}
        onChange={handleChangeFn}
        className="w-full border border-gray-300 p-2 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>
  );

  // Reusable function to render select dropdowns
  const renderSelect = (label, name, formDataObj, handleChangeFn, options, required = false) => (
    <div>
      <label className="block text-lg font-medium mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        name={name}
        value={formDataObj[name] || ""}
        onChange={handleChangeFn}
        className="w-full border border-gray-300 p-2 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
      >
        {options.map((option, idx) => (
          <option key={idx} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );

  // Fetch suggestions from the API
  const fetchSuggestions = async (query, setter) => {
    if (!query) {
      setter([]);
      return;
    }
    try {
      const res = await fetch(`/api/basesearch?query=${query}`);
      if (res.ok) {
        const data = await res.json();
        setter(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Station input handlers
  const handleBaseStationChange = (e) => {
    const query = e.target.value;
    setBaseStationQuery(query);
    fetchSuggestions(query, setBaseStationSuggestions);
  };

  const handleSelectBaseStation = (item) => {
    const selected = `${item.name} (${item.iata_code}, ${item.icao_code})`;
    updateFleetDetailsField("baseStation", selected);
    setBaseStationQuery(selected);
    setBaseStationSuggestions([]);
  };

  const handlepermanentBaseStationChange = (e) => {
    const query = e.target.value;
    setPermanentBaseStation(query);
    fetchSuggestions(query, setPermanentBaseStationSuggestions);
  };

  const handleSelectpermanentBaseStation = (item) => {
    const selected = `${item.name} (${item.iata_code}, ${item.icao_code})`;
    updateFleetDetailsField("permanentBaseStation", selected);
    setPermanentBaseStation(selected);
    setPermanentBaseStationSuggestions([]);
  };

  // Restricted airports multi-select
  const handleRestrictedAirportChange = (e) => {
    const query = e.target.value;
    setRestrictedAirportQuery(query);
    fetchSuggestions(query, setRestrictedAirportSuggestions);
  };

  const handleSelectRestrictedAirport = (item) => {
    let updatedArray = fleetDetails.restrictedAirports
      ? [...fleetDetails.restrictedAirports]
      : [];
    // Avoid duplicates
    if (!updatedArray.find((ap) => ap._id === item._id)) {
      updatedArray.push(item);
      const updatedDetails = { ...fleetDetails, restrictedAirports: updatedArray };
      updateFormData("fleetDetails", updatedDetails);
      sessionStorage.setItem("formData", JSON.stringify({ fleetDetails: updatedDetails }));
    }
    setRestrictedAirportQuery("");
    setRestrictedAirportSuggestions([]);
  };

  const handleRemoveRestrictedAirport = (id) => {
    let updatedArray = fleetDetails.restrictedAirports.filter((ap) => ap._id !== id);
    const updatedDetails = { ...fleetDetails, restrictedAirports: updatedArray };
    updateFormData("fleetDetails", updatedDetails);
    sessionStorage.setItem("formData", JSON.stringify({ fleetDetails: updatedDetails }));
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 bg-white shadow-lg rounded-xl border border-gray-100">
      <h1 className="text-4xl font-extrabold text-center mb-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-transparent bg-clip-text">
        Fleet Details Form
      </h1>
      <p className="text-sm text-red-500 mb-4">* Fields marked with * are mandatory</p>

      <form className="space-y-6">
        {/* Category & Model Selection */}
        <fieldset className="border border-gray-200 rounded-xl p-4 shadow-sm bg-gradient-to-br from-gray-50 to-gray-100">
          <legend className="text-xl font-semibold px-2">
            Category & Model Selection <span className="text-red-500">*</span>
          </legend>
          <ModelSelect
            selectedModel={selectedModel}
            setSelectedModel={(value) => {
              setSelectedModel(value);
              updateFleetDetailsField("selectedModel", value);
            }}
            flightType={flightType}
            setflightType={(value) => {
              setflightType(value);
              updateFleetDetailsField("flightType", value);
            }}
          />
        </fieldset>

        {/* Vendor Email (read-only) */}
        <div>
          <label className="block text-lg font-medium mb-1">Vendor Email</label>
          <input
            type="email"
            name="vendor_email"
            value={fleetDetails.vendor_email || ""}
            readOnly
            className="w-full border border-gray-300 rounded px-2 py-1 font-normal italic"
          />
        </div>

        {/* LOGO UPLOAD */}
        <div className="mt-4">
          <label className="block text-lg font-medium mb-1">Add Logo</label>
          <input
            type="file"
            name="logo"
            accept="image/*"
            onChange={handleLogoChange}
            className="w-full border border-gray-300 p-2 rounded-md"
          />
          {/* Optional in-page Preview */}
          {logoPreview && <img src={logoPreview} alt="Logo Preview" className="mt-2 h-16" />}
          {/* Show final URL if you want (just for debugging) */}
          {fleetDetails.logo && (
            <p className="text-sm mt-2 text-green-600 break-all">Logo URL: {fleetDetails.logo}</p>
          )}
        </div>

        {/* DOCUMENTS UPLOAD */}
        <div className="mt-4">
          <label className="block text-lg font-medium mb-1">Upload Documents</label>
          <input
            type="file"
            name="documents"
            onChange={handleDocumentsChange}
            className="w-full border border-gray-300 p-2 rounded-md"
          />
          {/* Show final doc link if you want */}
          {fleetDetails.documents && (
            <p className="text-sm mt-2 text-green-600 break-all">
              Document URL: {fleetDetails.documents}
            </p>
          )}
        </div>

        {/* Fleet Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderInput("Fleet Registration No", "registrationNo", fleetDetails, handleChange, "text", "", true)}
          {renderInput("Fleet Registration Date", "registrationDate", fleetDetails, handleChange, "date")}
          {renderInput("Fleet Max Speed", "maxSpeed", fleetDetails, handleChange, "text", "", true)}
          {renderInput("Pricing (Per / Hr)", "pricing", fleetDetails, handleChange, "text", "", true)}
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
          {renderInput("Max Seating Capacity", "seatCapacity", fleetDetails, handleChange, "number", "", true)}

          {/* Luggage capacity */}
          <div>
            <label className="block text-lg font-medium mb-1">
              Max Luggage Capacity (in Kgs) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="luggage"
              value={fleetDetails.luggage || ""}
              onChange={handleChange}
              onBlur={handleLuggageBlur}
              className="w-full border border-gray-300 p-2 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Permanent Base Station */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <label className="block text-lg font-medium mb-1">Permanent Base Station</label>
            <input
              type="text"
              name="permanentBaseStation"
              value={permanentBaseStationQuery}
              onChange={handlepermanentBaseStationChange}
              placeholder="Search Permanent Base Station"
              className="w-full border border-gray-300 p-2 rounded-md"
            />
            {permanentBaseStationSuggestions.length > 0 && (
              <ul className="absolute z-10 bg-white border mt-1 w-full max-h-60 overflow-auto">
                {permanentBaseStationSuggestions.map((item) => (
                  <li
                    key={item._id}
                    onClick={() => handleSelectpermanentBaseStation(item)}
                    className="p-2 cursor-pointer hover:bg-gray-200 text-sm"
                  >
                    {item.city}, {item.name}, {item.iata_code}, {item.icao_code}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Temporary Base Station */}
          <div className="relative">
            <label className="block text-lg font-medium mb-1">
              Base Station (Temporary) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="baseStation"
              value={baseStationQuery}
              onChange={handleBaseStationChange}
              placeholder="Search Base Station"
              className="w-full border border-gray-300 p-2 rounded-md"
            />
            {baseStationSuggestions.length > 0 && (
              <ul className="absolute z-10 bg-white border mt-1 w-full max-h-60 overflow-auto">
                {baseStationSuggestions.map((item) => (
                  <li
                    key={item._id}
                    onClick={() => handleSelectBaseStation(item)}
                    className="p-2 cursor-pointer hover:bg-gray-200 text-sm"
                  >
                    {item.city}, {item.name}, {item.iata_code}, {item.icao_code}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Restricted Airports Multi-select */}
        <div className="relative mt-4">
          <label className="block text-lg font-medium mb-1">Restricted Airports</label>
          <input
            type="text"
            name="restrictedAirport"
            value={restrictedAirportQuery}
            onChange={handleRestrictedAirportChange}
            placeholder="Search Restricted Airports"
            className="w-full border border-gray-300 p-2 rounded-md"
          />
          {restrictedAirportSuggestions.length > 0 && (
            <ul className="absolute z-10 bg-white border mt-1 w-full max-h-60 overflow-auto">
              {restrictedAirportSuggestions.map((item) => (
                <li
                  key={item._id}
                  onClick={() => handleSelectRestrictedAirport(item)}
                  className="p-2 cursor-pointer hover:bg-gray-200 text-sm"
                >
                  {item.city}, {item.name}, {item.iata_code}, {item.icao_code}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Display selected restricted airports */}
        {fleetDetails.restrictedAirports && fleetDetails.restrictedAirports.length > 0 && (
          <div className="mt-2">
            <h3 className="text-lg font-medium">Selected Restricted Airports:</h3>
            <ul>
              {fleetDetails.restrictedAirports.map((item) => (
                <li
                  key={item._id}
                  className="flex items-center justify-between border p-2 mt-1"
                >
                  <span className="text-sm">
                    {item.city}, {item.name}, {item.iata_code}, {item.icao_code}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveRestrictedAirport(item._id)}
                    className="text-red-500 text-sm"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Non-availability of Fleet */}
        <fieldset className="border border-gray-200 rounded-xl p-4 shadow-sm bg-gradient-to-br from-gray-50 to-gray-100 mt-4">
          <legend className="text-xl font-semibold px-2">Non-availability of Fleet</legend>
          <div className="flex items-center space-x-4 mt-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="fleetUnavailable"
                value="yes"
                checked={isFleetUnavailable === "yes"}
                onChange={handleUnavailabilityChange}
                className="mr-1"
              />
              Yes
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="fleetUnavailable"
                value="no"
                checked={isFleetUnavailable === "no"}
                onChange={handleUnavailabilityChange}
                className="mr-1"
              />
              No
            </label>
          </div>

          {isFleetUnavailable === "yes" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {renderInput(
                "From Date",
                "fromDate",
                unavailabilityDates,
                handleDateChange,
                "date"
              )}
              {renderInput("To Date", "toDate", unavailabilityDates, handleDateChange, "date")}
            </div>
          )}
        </fieldset>

        {/* Next Button */}
        <div className="flex justify-between mt-8">
          <Link
            href="/fleetRegistration/imageGallery"
            onClick={() => {
              const updatedFleetDetails = {
                ...fleetDetails,
                flightType,
                selectedModel,
                isFleetUnavailable,
                unavailabilityDates,
              };
              updateFormData("fleetDetails", updatedFleetDetails);
              sessionStorage.setItem("formData", JSON.stringify({ fleetDetails: updatedFleetDetails }));
            }}
            className="px-4 py-2 rounded-md bg-gradient-to-r from-green-400 to-green-500 text-white font-semibold shadow hover:scale-105 transition-transform"
          >
            Next
          </Link>
        </div>
      </form>
    </div>
  );
};

export default FleetDetailsForm;
