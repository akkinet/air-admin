"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaCheckCircle, FaSearch, FaPlusCircle } from "react-icons/fa";
const amenitiesData = [
  {
    category: "Transport",
    items: [
      "Airport Pickup",
      "Airport DropOff",
      "Vip Cab Pick & Drop",
      "Vvip Car inside Airport",
      "Vvip Car Pick & Drop",
      "VIP Car Pickup & Drop-off",
      "Meet & Greet Service",
      "Stops/Range",
      "Time",
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
      "Secure & Private Travel",
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
      "WiFi",
      "Satellite Phone on Demand",
      "Charging Points",
      "Air Host/Escort",
      "Table Availability",
      "Height",
      "Red Carpet Welcome",
      "Pets Allowed",
      "Private Lounge Access",
      "Club membership",
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
      "TV",
      "Music",
      "Bed",
    ],
  },
  {
    category: "Food & Beverages",
    items: [
      "Espresso Coffee Machine",
      "Hot and Cold Stations",
      "Bouquet",
      "Microwave",
      "Food Options: Hot/Cold Coffee, Custom Menu, On-Demand Food",
    ],
  },
  {
    category: "Medical",
    items: ["Medical Crew Escort", "Air Ambulance"],
  },
  {
    category: "Visa & Travel Docs",
    items: ["Visa on Arrival", "Golden Visa Scheme", "Diplomatic Visa", "VIP Category"],
  },
  {
    category: "Miscellaneous",
    items: [
      "Aircraft Make",
      "Private Jet",
      "Facility Ranking",
      "More Filters: Day/Night Flying, Weather Performance",
      "Insurance Coverage",
    ],
  },
];
const RadioGroup = ({ serviceName, selectedValue, onChange }) => {
  const options = [
    { value: "free", label: "Free of Cost" },
    { value: "chargeable", label: "Chargeable" },
    { value: "not_available", label: "Not Available" },
  ];

  return (
    <div className="mt-1 flex items-center space-x-4">
      {options.map((option) => (
        <label
          key={option.value}
          className="flex items-center space-x-1 cursor-pointer"
        >
          <input
            type="radio"
            name={`radio-${serviceName}`}
            value={option.value}
            checked={selectedValue === option.value}
            onChange={() => onChange(serviceName, option.value)}
          />
          <span>{option.label}</span>
        </label>
      ))}
    </div>
  );
};


const SelectedServiceRow = ({
  serviceName,
  serviceData,
  onRadioChange,
  onFieldChange,
  onRemove,
}) => {
  const { value, name, phone, email, address } = serviceData;

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white flex flex-col gap-2 md:gap-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="font-semibold text-lg">{serviceName}</h3>
          <RadioGroup
            serviceName={serviceName}
            selectedValue={value}
            onChange={onRadioChange}
          />
        </div>
        <button
          onClick={() => onRemove(serviceName)}
          className="mt-2 md:mt-0 text-red-500 border border-red-200 px-3 py-1 rounded hover:bg-red-50 self-start md:self-center"
        >
          Remove
        </button>
      </div>

      {/* If user picks 'free' or 'chargeable', show the optional fields */}
      {(value === "free" || value === "chargeable") && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Name (optional)"
              className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={name || ""}
              onChange={(e) => onFieldChange(serviceName, "name", e.target.value)}
            />
            <input
              type="tel"
              placeholder="Phone (optional)"
              className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={phone || ""}
              onChange={(e) => onFieldChange(serviceName, "phone", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="email"
              placeholder="Email (optional)"
              className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={email || ""}
              onChange={(e) => onFieldChange(serviceName, "email", e.target.value)}
            />
            <input
              type="text"
              placeholder="Address (optional)"
              className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={address || ""}
              onChange={(e) => onFieldChange(serviceName, "address", e.target.value)}
            />
          </div>
        </>
      )}
    </div>
  );
};

const AdditionalAmenities = () => {
 
  const [selectedServices, setSelectedServices] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // Load existing from sessionStorage on mount
  useEffect(() => {
    const formData = JSON.parse(sessionStorage.getItem("formData")) || {};
    const existing = formData.additionalAmenities || {};
    setSelectedServices(existing);
  }, []);

  // On “Next,” store only free/chargeable in session
  const handleNext = () => {
    const filteredServices = {};
    Object.keys(selectedServices).forEach((serviceName) => {
      if (selectedServices[serviceName].value !== "not_available") {
        filteredServices[serviceName] = selectedServices[serviceName];
      }
    });

    const formData = JSON.parse(sessionStorage.getItem("formData")) || {};
    formData.additionalAmenities = filteredServices;
    sessionStorage.setItem("formData", JSON.stringify(formData));
  };

  // Category selection
  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
    setSearchQuery("");
    setSearchResults([]);
  };

  // Add service
  const handleAddService = (serviceName) => {
    setSelectedServices((prev) => {
      if (prev[serviceName]) return prev; // Already added
      return {
        ...prev,
        [serviceName]: {
          value: "not_available",
          name: "",
          phone: "",
          email: "",
          address: "",
        },
      };
    });
  };

  // Remove service
  const handleRemoveService = (serviceName) => {
    setSelectedServices((prev) => {
      const { [serviceName]: _, ...rest } = prev;
      return rest;
    });
  };

  // Radio change
  const handleRadioChange = (serviceName, newValue) => {
    setSelectedServices((prev) => ({
      ...prev,
      [serviceName]: {
        ...prev[serviceName],
        value: newValue,
      },
    }));
  };

  // Name/phone/email/address
  const handleDetailsChange = (serviceName, field, val) => {
    setSelectedServices((prev) => ({
      ...prev,
      [serviceName]: {
        ...prev[serviceName],
        [field]: val,
      },
    }));
  };

  // Searching logic
  useEffect(() => {
    if (!searchQuery) {
      setSearchResults([]);
      return;
    }
    // Flatten all items
    let allServices = [];
    amenitiesData.forEach((cat) => {
      cat.items.forEach((svc) => {
        allServices.push(svc);
      });
    });
    // Filter
    const lowerQ = searchQuery.toLowerCase();
    const filtered = allServices.filter((svc) =>
      svc.toLowerCase().includes(lowerQ)
    );
    setSearchResults(filtered);
  }, [searchQuery]);

  /**
   * UI RENDER METHODS
   */
  const renderCategoryDropdown = () => (
    <div className="flex flex-col sm:flex-row items-center gap-2">
      <label className="font-semibold text-lg">Select Category:</label>
      <select
        value={selectedCategory}
        onChange={(e) => handleSelectCategory(e.target.value)}
        className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="">-- Choose Category --</option>
        {amenitiesData.map((cat) => (
          <option key={cat.category} value={cat.category}>
            {cat.category}
          </option>
        ))}
      </select>
    </div>
  );

  const renderCategoryItems = () => {
    if (!selectedCategory) return null;
    const found = amenitiesData.find((cat) => cat.category === selectedCategory);
    if (!found) return null;

    return (
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {found.items.map((svc) => {
          // Already selected?
          const isSelected = !!selectedServices[svc];
          return (
            <div
              key={svc}
              className={`p-4 border border-gray-200 rounded-lg bg-white flex items-center justify-between ${
                isSelected ? "opacity-60" : "opacity-100"
              }`}
            >
              <div className="flex items-center space-x-2">
                {/* Icon in front of the service name */}
                <FaCheckCircle className="text-indigo-600" />
                <span className="text-gray-700">{svc}</span>
              </div>
              <button
                onClick={() => handleAddService(svc)}
                disabled={isSelected}
                className={`text-sm px-3 py-1 rounded transition-colors ${
                  isSelected
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                {isSelected ? "Added" : "Add"}
              </button>
            </div>
          );
        })}
      </div>
    );
  };

  const renderSearchBar = () => (
    <div className="mt-6 relative max-w-md">
      <label className="block text-md font-semibold mb-1">Search Services</label>
      <div className="flex items-center relative">
        <FaSearch className="absolute left-3 text-gray-400" />
        <input
          type="text"
          className="border border-gray-300 rounded-md py-2 pl-10 pr-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      {searchResults.length > 0 && (
        <ul className="absolute z-10 bg-white w-full mt-1 border max-h-60 overflow-auto shadow-md rounded-md">
          {searchResults.map((svc) => {
            const isSelected = !!selectedServices[svc];
            return (
              <li
                key={svc}
                className={`px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center justify-between ${
                  isSelected ? "opacity-60" : ""
                }`}
                onClick={() => {
                  if (!isSelected) {
                    handleAddService(svc);
                  }
                  setSearchQuery("");
                  setSearchResults([]);
                }}
              >
                <span>{svc}</span>
                {isSelected && <span className="text-sm text-green-600">Added</span>}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );

  const renderSelectedServices = () => {
    const serviceNames = Object.keys(selectedServices).sort();
    if (serviceNames.length === 0) return null;

    return (
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Selected Services</h2>
        <div className="space-y-4">
          {serviceNames.map((svc) => (
            <SelectedServiceRow
              key={svc}
              serviceName={svc}
              serviceData={selectedServices[svc]}
              onRadioChange={handleRadioChange}
              onFieldChange={handleDetailsChange}
              onRemove={handleRemoveService}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-12 px-6 max-w-6xl">
      <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-10 bg-gradient-to-r from-indigo-500 to-purple-500 text-transparent bg-clip-text">
        Additional Amenities
      </h1>

      <div className="bg-white p-6 rounded-lg shadow space-y-6">
        {renderCategoryDropdown()}
        {renderCategoryItems()}
        {renderSearchBar()}
        {renderSelectedServices()}

        <div className="flex justify-between mt-8">
          <Link
            href="/fleetRegistration/travelModes"
            className="px-8 py-3 rounded-lg bg-gradient-to-r from-red-400 to-red-500 text-white font-semibold shadow-lg hover:scale-105 transition-transform"
          >
            Back
          </Link>
          <Link
            href="/fleetRegistration/preview"
            onClick={handleNext}
            className="px-8 py-3 rounded-lg bg-gradient-to-r from-green-400 to-green-500 text-white font-semibold shadow-lg hover:scale-110 transition-transform"
          >
            Next
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdditionalAmenities;
