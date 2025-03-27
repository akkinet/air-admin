"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useFormContext } from "../../context/FormContext"; // <-- Import your context

// A configuration array for the modes, so we can loop more cleanly
const modes = [
  { id: "sitting", name: "Sitting Mode", fields: ["Seats", "Bags (Kg)", "Restroom"] },
  { id: "night", name: "Night Mode", fields: ["Common Beds", "Private Rooms", "Recliners"] },
  { id: "press", name: "Press Mode", fields: ["Podium", "Seats"] },
  { id: "medical", name: "Medical Mode", fields: ["Patient Beds", "Guest Seats"] },
  {
    id: "cargo",
    name: "Cargo Mode",
    fields: ["Weight in (TONS)", "Length (ft)", "Height (ft)", "Width (ft)"],
  },
];

export default function TravelModes() {
  const { formData, updateFormData } = useFormContext();
  const [selectedModes, setSelectedModes] = useState([]);
  const [modeDetails, setModeDetails] = useState({});

  // On mount, load travelModes from either sessionStorage or context
  useEffect(() => {
    // If sessionStorage has data, prefer that; otherwise fallback to context
    const savedData = JSON.parse(sessionStorage.getItem("formData")) || {};
    const existingModes = savedData.travelModes || formData.travelModes || {};

    // Create fresh local state for all possible modes
    const newModeDetails = {};
    modes.forEach((m) => {
      newModeDetails[m.id] = existingModes[m.id] || {};
    });
    setModeDetails(newModeDetails);

    // Build an array of which mode IDs have data
    const selected = Object.keys(existingModes).filter(
      (modeId) => Object.keys(existingModes[modeId] || {}).length > 0
    );
    setSelectedModes(selected);

    // Also ensure context is in sync if we loaded from session
    if (savedData.travelModes) {
      updateFormData("travelModes", savedData.travelModes);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Toggling a mode’s checkbox
  const handleCheckboxChange = (modeId) => {
    let updatedSelected;
    if (selectedModes.includes(modeId)) {
      // If it was selected, uncheck it
      updatedSelected = selectedModes.filter((id) => id !== modeId);
      // Clear out data from that mode
      setModeDetails((prev) => ({ ...prev, [modeId]: {} }));
    } else {
      // If it was not selected, select it
      updatedSelected = [...selectedModes, modeId];
    }

    setSelectedModes(updatedSelected);

    // Immediately update local “travelModes” + sessionStorage + context
    const existingFormData = JSON.parse(sessionStorage.getItem("formData")) || {};
    const travelModes = existingFormData.travelModes || { ...formData.travelModes };

    // If unselected now, clear data
    if (!updatedSelected.includes(modeId)) {
      travelModes[modeId] = {};
    } else {
      // If newly selected, ensure the data object exists
      travelModes[modeId] = modeDetails[modeId] || {};
    }

    existingFormData.travelModes = travelModes;
    sessionStorage.setItem("formData", JSON.stringify(existingFormData));
    updateFormData("travelModes", travelModes); // Keep context in sync
  };

  // User typing into any numeric field
  const handleInputChange = (modeId, field, value) => {
    const isFtField = field.includes("(ft)");
    const cleanedField = field.replace(" (ft)", "");
    const prevModeData = modeDetails[modeId] || {};
    let updatedModeData = {};

    if (isFtField) {
      // If it's a dimension field for cargo, store under "Space"
      const existingSpace = prevModeData.Space || {};
      updatedModeData = {
        ...prevModeData,
        Space: {
          ...existingSpace,
          [cleanedField]: value,
        },
      };
    } else {
      // Otherwise, store e.g. "Seats": { "Seats": "12" }
      updatedModeData = {
        ...prevModeData,
        [field]: {
          [field]: value,
        },
      };
    }

    // Update local state
    setModeDetails((prev) => ({
      ...prev,
      [modeId]: updatedModeData,
    }));

    // Also update session storage + context
    const existingFormData = JSON.parse(sessionStorage.getItem("formData")) || {};
    const travelModes = existingFormData.travelModes || { ...formData.travelModes };
    travelModes[modeId] = updatedModeData;
    existingFormData.travelModes = travelModes;
    sessionStorage.setItem("formData", JSON.stringify(existingFormData));
    updateFormData("travelModes", travelModes);
  };

  // On "Next," store final data (optional if you already store on each change)
  const handleNextClick = () => {
    const existingFormData = JSON.parse(sessionStorage.getItem("formData")) || {};
    existingFormData.travelModes = modeDetails;

    // Update session storage + context
    sessionStorage.setItem("formData", JSON.stringify(existingFormData));
    updateFormData("travelModes", modeDetails);
  };

  return (
    <div className="container mx-auto py-12 px-6 max-w-6xl">
      <h1 className="text-5xl font-extrabold text-center mb-12 bg-gradient-to-r from-indigo-500 to-purple-500 text-transparent bg-clip-text">
        Select Travel Modes
      </h1>

      {/* Mode checkboxes */}
      <div className="bg-white p-6 rounded-lg shadow space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {modes.map((mode) => (
            <div
              key={mode.id}
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-xl hover:shadow transition-all"
            >
              <input
                type="checkbox"
                id={mode.id}
                className="w-5 h-5 text-indigo-500 rounded focus:ring-0"
                checked={selectedModes.includes(mode.id)}
                onChange={() => handleCheckboxChange(mode.id)}
              />
              <label htmlFor={mode.id} className="font-semibold cursor-pointer">
                {mode.name}
              </label>
            </div>
          ))}
        </div>

        {/* Render inputs for each selected mode */}
        <div className="space-y-8">
          {selectedModes.map((modeId) => {
            const thisMode = modes.find((m) => m.id === modeId);
            if (!thisMode) return null;

            return (
              <div
                key={modeId}
                className="border border-gray-200 rounded-xl p-6 shadow"
              >
                <h2 className="text-2xl font-bold mb-6">{thisMode.name}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {thisMode.fields.map((label) => (
                    <div key={label}>
                      <label className="block text-md font-semibold mb-2">
                        {label}
                      </label>
                      <input
                        type="number"
                        placeholder="0"
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        onChange={(e) =>
                          handleInputChange(modeId, label, e.target.value)
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between mt-10">
        <Link href="/fleetRegistration/imageGallery">
          <button className="px-8 py-3 rounded-lg bg-gradient-to-r from-red-400 to-red-500 text-white font-semibold shadow-lg hover:scale-105 transition-transform">
            Back
          </button>
        </Link>

        <Link href="/fleetRegistration/addonServices">
          <button
            onClick={handleNextClick}
            className="px-8 py-3 rounded-lg bg-gradient-to-r from-green-400 to-green-500 text-white font-semibold shadow-lg hover:scale-105 transition-transform"
          >
            Next
          </button>
        </Link>
      </div>
    </div>
  );
}
