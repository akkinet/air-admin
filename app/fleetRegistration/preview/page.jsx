"use client";
import React from "react";
import { useFormContext } from "../../context/FormContext";

const PreviewPage = () => {
  const { formData } = useFormContext();

  const handleSubmit = () => {
    console.log("Form Submitted Data:", formData);
    alert("Form submitted successfully!");
  };

  return (
    <div className="container mx-auto py-12 px-6">
      <h1 className="text-4xl font-bold mb-8">Preview</h1>
      <div>
        <h2>Fleet Details:</h2>
        {Object.entries(formData.fleetDetails).map(([key, value]) => (
          <p key={key}>{key}: {value}</p>
        ))}
      </div>
      
      <button onClick={handleSubmit} className="bg-green-500 text-white px-6 py-2 mt-8">
        Submit
      </button>
    </div>
  );
};

export default PreviewPage;
