import React, { useState, useEffect } from 'react';
import airportsData from '../../app/airports.json';  // Import JSON data

const AirportsSelect = ({ type, selectedCountry, setSelectedCountry, selectedAirports, setSelectedAirports }) => {
  const [countries, setCountries] = useState([]);
  const [filteredAirports, setFilteredAirports] = useState([]);

  useEffect(() => {
    setCountries(Object.keys(airportsData));
  }, []);

  useEffect(() => {
    if (selectedCountry && airportsData[selectedCountry]) {
      setFilteredAirports(airportsData[selectedCountry]);
    } else {
      setFilteredAirports([]);
    }
  }, [selectedCountry]);

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setSelectedAirports([]);  // Reset airports when country changes
  };

  const handleSelect = (airport) => {
    if (airport === 'None') {
      setSelectedAirports(['None']);
    } else {
      const updatedAirports = selectedAirports.filter((a) => a !== 'None');
      if (!updatedAirports.includes(airport)) {
        updatedAirports.push(airport);
      }
      setSelectedAirports([...updatedAirports]);
    }
  };

  const handleRemoveAirport = (airport) => {
    setSelectedAirports(selectedAirports.filter((a) => a !== airport));
  };

  const handleRemoveCountry = () => {
    setSelectedCountry('');
    setSelectedAirports([]);
  };

  return (
    <div>
      {/* Selected Country Tag */}
      {type === 'permitted' && selectedCountry && (
        <div className="flex items-center gap-2 bg-blue-100 p-2 rounded mb-2">
          <span>{selectedCountry}</span>
          <button
            onClick={handleRemoveCountry}
            className="text-red-500 font-bold"
          >
            &times;
          </button>
        </div>
      )}

      {/* Permitted Country Dropdown */}
      {type === 'permitted' && (
        <select
          onChange={(e) => handleCountrySelect(e.target.value)}
          value={selectedCountry || ''}
          className="w-full border border-gray-300 p-2 rounded-md"
        >
          <option value="">Select Country</option>
          <option value="All">All</option>
          {countries.map((country, index) => (
            <option key={index} value={country}>
              {country}
            </option>
          ))}
        </select>
      )}

      {/* Selected Airports Tags */}
      {selectedAirports.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4 mb-2">
          {selectedAirports.map((airport, index) => (
            <div key={index} className="flex items-center bg-blue-100 p-2 rounded">
              {airport}
              <button
                onClick={() => handleRemoveAirport(airport)}
                className="ml-2 text-red-500"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Restricted Airports Dropdown */}
      {type === 'restricted' && (
        <select
          onChange={(e) => handleSelect(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded-md cursor-pointer"
          disabled={!selectedCountry}
          value=""
        >
          <option value="" disabled>Select Restricted Airport</option>
          <option value="None">None</option>
          {filteredAirports.map((airport, index) => (
            <option key={index} value={airport}>
              {airport}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default AirportsSelect;
