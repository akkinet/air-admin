"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const TravelModes = () => {
  const [selectedModes, setSelectedModes] = useState([]);
  const [modeDetails, setModeDetails] = useState({});

  const modes = [
    { id: "sitting", name: "Sitting Mode" },
    { id: "night", name: "Night Mode" },
    { id: "press", name: "Press Mode" },
    { id: "medical", name: "Medical Mode" },
    { id: "cargo", name: "Cargo Mode" },
  ];

  useEffect(() => {
    const savedData = JSON.parse(sessionStorage.getItem("formData")) || {};
    const existingModes = savedData.travelModes || {};

    // Initialize mode details from storage or as empty
    setModeDetails({
      ...Object.fromEntries(modes.map((mode) => [mode.id, existingModes[mode.id] || {}])),
    });

    // Track selected modes
    setSelectedModes(Object.keys(existingModes).filter((key) => Object.keys(existingModes[key]).length > 0));
  }, []);

  const handleCheckboxChange = (modeId) => {
    let updatedModes;
  
    if (selectedModes.includes(modeId)) {
      updatedModes = selectedModes.filter((id) => id !== modeId);
      setModeDetails((prev) => ({ ...prev, [modeId]: {} }));  // Reset to empty object if unchecked
    } else {
      updatedModes = [...selectedModes, modeId];
      setModeDetails((prev) => ({ ...prev, [modeId]: prev[modeId] || {} }));
    }
  
    setSelectedModes(updatedModes);
  
    // Directly update travelModes in session storage
    const existingFormData = JSON.parse(sessionStorage.getItem("formData")) || {};
    existingFormData.travelModes = {
      ...existingFormData.travelModes,
      [modeId]: modeDetails[modeId] || {},
    };
    
    sessionStorage.setItem("formData", JSON.stringify(existingFormData));
  };
  

  const handleInputChange = (modeId, field, value) => {
    const updatedDetails = {
      ...modeDetails,
      [modeId]: {
        ...modeDetails[modeId],
        [field.includes("(ft)") ? "Space" : field]: {
          ...(modeDetails[modeId]?.Space || {}),
          [field.replace(" (ft)", "")]: value,
        },
      },
    };
    setModeDetails(updatedDetails);
  
    // Update existing travelModes directly in session storage
    const existingFormData = JSON.parse(sessionStorage.getItem("formData")) || {};
    existingFormData.travelModes[modeId] = updatedDetails[modeId];
  
    sessionStorage.setItem("formData", JSON.stringify(existingFormData));
  };
  
  

  const renderModeDetails = (modeId) => {
    const modeConfig = {
      sitting: ["Seats", "Bags (Kg)", "Restroom"],
      night: ["Common Beds", "Private Rooms", "Recliners"],
      press: ["Podium", "Seats"],
      medical: ["Patient Beds", "Guest Seats"],
      cargo: ["Weight in (TONS)", "Length (ft)", "Height (ft)", "Width (ft)"],  
    };
    

    return (
      <ModeSection title={modes.find((m) => m.id === modeId).name}>
        {modeConfig[modeId]?.map((label) => (
          <ModeInput
            key={label}
            label={label}
            modeId={modeId}
            handleInputChange={handleInputChange}
          />
        ))}
      </ModeSection>
    );
  };

  const handleNextClick = () => {
    const existingFormData = JSON.parse(sessionStorage.getItem("formData")) || {};
    const finalFormData = {
      ...existingFormData,
      travelModes: {
        ...Object.fromEntries(modes.map((mode) => [mode.id, modeDetails[mode.id] || {}])),
      },
    };

    // Store final data and console log it
    sessionStorage.setItem("formData", JSON.stringify(finalFormData));
  };

  return (
    <div className="container mx-auto py-12 px-6 max-w-5xl">
      <h1 className="text-5xl font-extrabold text-center mb-12 bg-gradient-to-r from-indigo-500 to-purple-500 text-transparent bg-clip-text">
        Select Travel Modes
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {modes.map((mode) => (
          <div
            key={mode.id}
            className="flex items-center space-x-4 p-6 border border-gray-200 rounded-xl shadow-md bg-gradient-to-br from-gray-50 to-gray-100 hover:shadow-lg transition-all"
          >
            <input
              type="checkbox"
              id={mode.id}
              className="w-5 h-5 text-indigo-500 rounded focus:ring-0"
              checked={selectedModes.includes(mode.id)}
              onChange={() => handleCheckboxChange(mode.id)}
            />
            <label
              htmlFor={mode.id}
              className="text-lg font-semibold text-gray-800 cursor-pointer"
            >
              {mode.name}
            </label>
          </div>
        ))}
      </div>

      <div className="space-y-12">
        {selectedModes.map((mode) => (
          <div key={mode}>{renderModeDetails(mode)}</div>
        ))}
      </div>

      <div className="flex justify-between mt-16">
        <Link href="/fleetRegistration/imageGallery">
          <button className="px-8 py-3 rounded-lg bg-red-500 text-white font-semibold shadow-lg hover:scale-105 transition-transform">
            Back
          </button>
        </Link >
        <Link href="/fleetRegistration/addonServices">
        
        <button
          onClick={handleNextClick}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg transition duration-200"
        >
          Next
        </button>
        </Link>
      </div>
    </div>
  );
};

const ModeSection = ({ title, children }) => (
  <div className="border border-gray-200 rounded-2xl p-8 shadow-lg">
    <h2 className="text-3xl font-bold mb-8">{title}</h2>
    <div className="flex flex-wrap gap-6">
      {children}
    </div>
  </div>
);


const ModeInput = ({ label, modeId, handleInputChange }) => (
  <div>
    <label className="block text-lg font-medium mb-2">{label}</label>
    <input
      type="number"
      className="w-full p-4 border rounded-lg"
      onChange={(e) => handleInputChange(modeId, label, e.target.value)}
    />
  </div>
);

export default TravelModes;
