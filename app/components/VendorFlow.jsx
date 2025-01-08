"use client"
import { useState } from "react";
import VendorWelcomePage from "./VendorWelcomePage";
import VendorThankYouPage from "./VendorThankyouPage";

export default function VendorFlow() {
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  // Simulate form submission (replace this with actual form logic)
  const handleFormSubmit = () => {
    setIsFormSubmitted(true);
  };

  return (
    <div>
      {!isFormSubmitted ? (
        <VendorWelcomePage />
      ) : (
        <VendorThankYouPage />
      )}

      {!isFormSubmitted && (
        <div className="text-center mt-8">
          <button
            onClick={handleFormSubmit}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
          >
            Submit Form
          </button>
        </div>
      )}
    </div>
  );
}
