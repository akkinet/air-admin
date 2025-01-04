"use client";
import { useState } from "react";
import Link from "next/link";

const TravelModes = () => {
  const [selectedModes, setSelectedModes] = useState([]);

  const modes = [
    { id: "sitting", name: "Sitting Mode" },
    { id: "night", name: "Night Mode" },
    { id: "press", name: "Press Mode" },
    { id: "medical", name: "Medical Mode" },
    { id: "cargo", name: "Cargo Mode" },
  ];

  const handleCheckboxChange = (modeId) => {
    if (selectedModes.includes(modeId)) {
      setSelectedModes(selectedModes.filter((id) => id !== modeId));
    } else {
      setSelectedModes([...selectedModes, modeId]);
    }
  };

  const renderModeDetails = (mode) => {
    switch (mode) {
      case "sitting":
        return (
          <ModeSection title="Sitting Mode">
            <ModeInput label="Seats" />
            <ModeInput label="Bags (Kg)" />
            <ModeInput label="Restroom" />
            <FileUpload label="Fleet Layout Image" />
          </ModeSection>
        );
      case "night":
        return (
          <ModeSection title="Night Mode">
            <ModeInput label="Common Beds" />
            <ModeInput label="Private Rooms" />
            <ModeInput label="Recliners" />
            <ModeInput label="Private Bed Rooms" />
            <FileUpload label="Fleet Layout Image" />
          </ModeSection>
        );
      case "press":
        return (
          <ModeSection title="Press Mode">
            <ModeInput label="Podium" />
            <ModeInput label="Seats" />
            <FileUpload label="Fleet Layout Image" />
          </ModeSection>
        );
      case "medical":
        return (
          <ModeSection title="Medical Mode">
            <ModeInput label="Patient Beds" />
            <ModeInput label="Guest Seats" />
            <ModeInput label="Medical Crew Seats" />
            <FileUpload label="Fleet Layout Image" />
          </ModeSection>
        );
      case "cargo":
        return (
          <ModeSection title="Cargo Mode">
            <ModeInput label="Weight in (TONS)" />
            <ModeInput label="Space (L X H X W) in Feets" />
            <FileUpload label="Fleet Layout Image" />
          </ModeSection>
        );
      default:
        return null;
    }
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
          <div key={mode}>
            {renderModeDetails(mode)}
          </div>
        ))}
      </div>


      <div className="flex justify-between mt-16">
        <Link
          href="/fleetRegistration/imageGallery"
          className="px-8 py-3 rounded-lg bg-gradient-to-r from-red-400 to-red-500 text-white font-semibold shadow-lg hover:scale-105 transition-transform"
        >
          Back
        </Link>
        <Link
          href="/fleetRegistration/addonServices"
          className="px-8 py-3 rounded-lg bg-gradient-to-r from-green-400 to-green-500 text-white font-semibold shadow-lg hover:scale-105 transition-transform"
        >
          Next
        </Link>
      </div>
    </div>
  );
};

const ModeSection = ({ title, children }) => (
  <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-white to-gray-50 p-8">
    <h2 className="text-3xl font-bold mb-8 text-gray-900">{title}</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">{children}</div>
  </div>
);

const ModeInput = ({ label }) => (
  <div>
    <label className="block text-lg font-medium text-gray-700 mb-2">
      {label}
    </label>
    <input
      type="number"
      placeholder="Number (Integer)"
      className="w-full p-4 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
    />
  </div>
);

const FileUpload = ({ label }) => (
  <div className="col-span-1">
    <label className="block text-lg font-medium text-gray-700 mb-4">
      {label}
    </label>
    <div className="flex items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-indigo-500 hover:bg-indigo-50 transition-all">
      <input type="file" className="hidden" />
      <p className="text-sm text-gray-500">Upload or drag files here.</p>
    </div>
  </div>
);

export default TravelModes;
