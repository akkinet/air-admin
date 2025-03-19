"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

const amenitiesData = [
  {
    category: "Transport",
    items: [
      "Airport Pickup",
      "Airport DropOff",
      "Vip Cab Pick & Drop",
      "Vvip Car inside Airport",
      "Vvip car Pick & Drop",
      "choti ladki service "
    ],
  },
  {
    category: "Security",
    items: [
      "Secret Service",
      "Private Security",
      "Security",
      "Emergency Evacuation",
      "Personal Gate",
    ],
  },
  {
    category: "Comfort",
    items: [
      "Lounge Access",
      "Cafe",
      "Full Bar",
      "Life Jacket",
      "Power Supply 110V",
    ],
  },
  {
    category: "Entertainment",
    items: [
      "Music System Surround Sound",
      "New FHD Monitor",
      "Brand new Interior",
      "Brand new Paint",
      "Red Carpet",
    ],
  },
  {
    category: "Miscellaneous",
    items: [
      "Espresso Coffee Machine",
      "Hot and Cold Stations",
      "Bouquet",
      "Microwave",
      "Air Hostess / Escorts",
    ],
  },
];

// Reusable Radio Group Component
const RadioGroup = ({ name, selectedValue, onChange }) => {
  const options = [
    { value: "free", label: "Free of Cost" },
    { value: "chargeable", label: "Chargeable" },
    { value: "not_available", label: "Not Available" },
  ];

  return (
    <div className="mt-2 flex items-center space-x-6">
      {options.map((option) => (
        <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={selectedValue === option.value}
            onChange={() => onChange(name, option.value)}
            className="w-5 h-5 accent-blue-500 focus:ring-0"
          />
          <span>{option.label}</span>
        </label>
      ))}
    </div>
  );
};

// Amenity Card Component
const AmenityCard = ({ item, selectedValues, onChange, onDetailsChange }) => {
  const selectedValue = selectedValues[item]?.value || "not_available";

  return (
    <div className="p-6 border border-gray-200 rounded-xl shadow-md bg-gradient-to-br from-gray-50 to-white hover:shadow-lg transition-all">
      <h3 className="text-lg font-semibold mb-4">{item}</h3>
      <RadioGroup
        name={item}
        selectedValue={selectedValue} // Pass only the value
        onChange={(name, value) => onChange(name, value)}
      />
      {(selectedValue === "chargeable" || selectedValue === "free") && (
        <div className="mt-4 space-y-4">
          <input
            type="text"
            placeholder="Name (optional)"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            value={selectedValues[item]?.name || ""}
            onChange={(e) => onDetailsChange(item, "name", e.target.value)}
          />
          <input
            type="tel"
            placeholder="Phone Number (optional)"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            value={selectedValues[item]?.phone || ""}
            onChange={(e) => onDetailsChange(item, "phone", e.target.value)}
          />
        </div>
      )}
    </div>
  );
};

// Main Component
const AdditionalAmenities = () => {
  const [selectedValues, setSelectedValues] = useState({});

  // Load data from session storage on mount and initialize defaults
  useEffect(() => {
    const formData = JSON.parse(sessionStorage.getItem("formData")) || {};
    let amenities = formData.additionalAmenities || {};
  
    amenitiesData.forEach((section) => {
      section.items.forEach((item) => {
        if (!amenities[item]) {
          amenities[item] = { value: "not_available", name: "", phone: "" }; // Correct structure
        }
      });
    });
  
    setSelectedValues(amenities);
  }, []);
  

  const handleChange = (name, value) => {
    const updatedValues = {
      ...selectedValues,
      [name]: {
        ...selectedValues[name],
        value,
      },
    };
    setSelectedValues(updatedValues);
  };
  const handleDetailsChange = (name, field, value) => {
    const updatedValues = {
      ...selectedValues,
      [name]: {
        ...selectedValues[name],
        [field]: value,
      },
    };
    setSelectedValues(updatedValues);
  };


  const handleNext = () => {
    const formData = JSON.parse(sessionStorage.getItem("formData")) || {};
    formData.additionalAmenities = selectedValues;
    sessionStorage.setItem("formData", JSON.stringify(formData));
  };


  return (
    <div className="container mx-auto py-12 px-6 max-w-6xl">
      <h1 className="text-5xl font-extrabold text-center mb-12 bg-gradient-to-r from-indigo-500 to-purple-500 text-transparent bg-clip-text">
        Additional Amenities
      </h1>

      {amenitiesData.map((section, idx) => (
        <div key={idx} className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">{section.category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {section.items.map((item) => (
              <AmenityCard
                key={item}
                item={item}
                selectedValues={selectedValues}
                onChange={handleChange}
                onDetailsChange={handleDetailsChange}
              />

            ))}
          </div>
        </div>
      ))}

      <div className="flex justify-between mt-16">
        <Link
          href={"/fleetRegistration/travelModes"}
          className="px-8 py-3 rounded-lg bg-gradient-to-r from-red-400 to-red-500 text-white font-semibold shadow-lg hover:scale-105 transition-transform"
        >
          Back
        </Link>
        <Link
          href={"/fleetRegistration/preview"}
          className="px-8 py-3 rounded-lg bg-gradient-to-r from-green-400 to-green-500 text-white font-semibold shadow-lg hover:scale-110 transition-transform"
          onClick={handleNext}
        >
          Next
        </Link>
      </div>
    </div>
  );
};

export default AdditionalAmenities;
