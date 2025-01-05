import React, { useState, useEffect } from 'react';
import airportsData from '../../app/aircraft_category.json';

const ModelSelect = ({ selectedCategory, setSelectedCategory, selectedModel, setSelectedModel }) => {
  const [categories, setCategories] = useState([]);
  const [filteredModels, setFilteredModels] = useState([]);

  useEffect(() => {
    setCategories(Object.keys(airportsData));
  }, []);

  useEffect(() => {
    if (selectedCategory && airportsData[selectedCategory]) {
      setFilteredModels(airportsData[selectedCategory]);
    } else {
      setFilteredModels([]);
    }
  }, [selectedCategory]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedModel('None');  // Reset model to "None" when category changes or is deselected
  };

  const handleModelSelect = (model) => {
    setSelectedModel(model);
  };

  return (
    <div className="flex gap-4 items-start">
      {/* Category Dropdown */}
      <div className="w-1/2">
        <select
          onChange={(e) => handleCategorySelect(e.target.value)}
          value={selectedCategory || ''}
          className="w-full border border-gray-300 p-2 rounded-md"
        >
          <option value="">Select Category</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Model Dropdown - Always Visible */}
      <div className="w-1/2">
        <select
          onChange={(e) => handleModelSelect(e.target.value)}
          value={selectedModel || 'None'}
          className="w-full border border-gray-300 p-2 rounded-md"
        >
          <option value="None">None</option>
          {filteredModels.map((model, index) => (
            <option key={index} value={model}>
              {model}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ModelSelect;
