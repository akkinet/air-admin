"use client";
import { useState } from "react";
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaWhatsapp,
  FaBuilding,
  FaMapMarkerAlt,
  FaCity,
  FaMap,
  FaMapPin,
  FaGlobe,
  FaPhoneAlt,
  FaTwitter,
  FaUpload
} from "react-icons/fa";

export default function BusinessInformationForm() {
  const [formData, setFormData] = useState({
    corporateOffice: "",
    email: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    vendorFirstName: "",
    vendorLastName: "",
    operationsCoverage: "",
    operationsType: [],
    primaryPhone: "",
    baseCountry: "India",
    // baseCity: "",
    // companyName: "",
    // vendorName: "",
    additionalPhone1: "",
    additionalPhone2: "",
    facebook: "",
    instagram: "",
    twitter: "",
    whatsapp: "",
    contactPreference: "phone",
    businessDescription: "",
  });

  const [errors, setErrors] = useState({});
  const [branches, setBranches] = useState([{ branchId: 1 }]); // Branch 1 added by default
  const [hasBranches, setHasBranches] = useState(false); // To track "Yes" or "No"

  const addBranch = () => {
    setBranches([...branches, { branchId: branches.length + 1 }]);
  };



  const validateField = (name, value) => {
    let error = "";
    if (name.startsWith("departmentName_") || name.startsWith("contactNo_") || name.startsWith("email_")) {
      if (!value) {
        error = "This field is required.";
      }
      if (name.startsWith("email_") && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        error = "Invalid email address.";
      }
      if (name.startsWith("contactNo_") && value && !/^\d{10,15}$/.test(value)) {
        error = "Phone number must be 10-15 digits.";
      }
    } else {
      // Business Details Validation
      switch (name) {
        case "email":
          if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            error = "Invalid email address.";
          }
          break;
        case "primaryPhone":
        case "additionalPhone1":
        case "additionalPhone2":
        case "whatsapp":
          if (value && !/^\d{10,15}$/.test(value)) {
            error = "Phone number must be 10-15 digits.";
          }
          break;
        case "zipCode":
          if (value && !/^\d{5,10}$/.test(value)) {
            error = "Invalid ZIP code.";
          }
          break;
        default:
          if (!value) {
            error = "This field is required.";
          }
      }
    }
    return error;
  };

const handleChange = (e) => {
  const { name, value, type, checked } = e.target;

  if (type === "checkbox") {
    setFormData((prev) => ({
      ...prev,
      operationsType: checked
        ? [...prev.operationsType, value]
        : prev.operationsType.filter((item) => item !== value),
    }));
  } else {
    const error = validateField(name, value);

    if (name.startsWith("departmentName_") || name.startsWith("contactNo_") || name.startsWith("email_") || name.startsWith("photo_") || name.startsWith("addressLine1_") || name.startsWith("addressLine2_") || name.startsWith("city_") || name.startsWith("state_") || name.startsWith("zipCode_")) {
      // Update branch-specific state
      const [fieldKey, index] = name.split("_");
      setBranches((prev) =>
        prev.map((branch, i) => {
          if (i === parseInt(index, 10)) {
            return { ...branch, [fieldKey]: value };
          }
          return branch;
        })
      );
      setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
    } else {
      // Update main form state
      setFormData((prev) => ({ ...prev, [name]: value }));
      setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
    }
  }
};


const handleSubmit = (e) => {
  e.preventDefault();

  // Validate Main Form
  const newErrors = {};
  const missingFields = [];

  Object.keys(formData).forEach((key) => {
    const error = validateField(key, formData[key]);
    if (error) {
      newErrors[key] = error;
      missingFields.push(key);
    }
  });

  // Validate Branches
  branches.forEach((branch, index) => {
    Object.keys(branch).forEach((key) => {
      const fieldName = `${key}_${index}`;
      const error = validateField(fieldName, branch[key]);
      if (error) {
        newErrors[fieldName] = error;
        missingFields.push(fieldName);
      }
    });
  });

  // Set Errors
  setErrors(newErrors);

  if (Object.keys(newErrors).length > 0) {
    const fieldNames = missingFields
      .map((field) => {
        if (field.includes("_")) {
          const [fieldKey, index] = field.split("_");
          return `Branch ${parseInt(index, 10) + 1} - ${fieldKey}`;
        }
        return field;
      })
      .join(", ");

    alert(`Please fill in all required fields: ${fieldNames}`);
  } else {
    console.log("Main Form Data:", formData);
    console.log("Branch Data:", branches); // This now includes photo, address, city, state, and zip code
    alert("Form submitted successfully!");
  }
};

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8 mt-5 font-medium italic">
      <h1 className="text-2xl font-semibold mb-4">Business Information</h1>

      <div className="mb-6 relative">
        {/* Video Section */}
        <video loop autoPlay muted className="w-full rounded-lg shadow-lg">
          <source
            src="https://s3.ap-south-1.amazonaws.com/medicom.hexerve/airplane+video.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>

        {/* Text Overlay */}
        <div className="absolute top-1/2 right-8 bg-black bg-opacity-50 text-white p-4 rounded-lg">
          <h2 className="text-3xl font-bold mb-2">Vendor Onboarding Form</h2>
          <p className="text-lg mb-1">Welcome to the Air Aviation Services</p>
          <p className="text-sm">
            Let's get you started now by filling in your business details.
          </p>
        </div>
      </div>
      {/* Business Description */}
      <div className="mb-4">
        <label className="">Business Description</label>
        <textarea
          name="businessDescription"
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-4 py-2"
          rows="4"
          placeholder="Write a short description about your business"
        />
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">

        {/* Business Details */}
        <fieldset className="border-2 border-gray-500 rounded p-4">
          <legend className="font-semibold text-xl">Business Details</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div>
            <label className=" mb-2 flex items-center gap-2">
              <span className="text-blue-500">
                <FaUser />
              </span>
              Vendor / Operator First Name
            </label>
            <input
              type="text"
              name="vendorFirstName"
              onChange={handleChange}
              placeholder="Enter the first word of name"
              className="w-full border border-gray-300 rounded px-4 py-1 font-normal italic"
            />
            {errors.vendorFirstName && (
              <p className="text-red-500 text-sm">{errors.vendorFirstName}</p>
            )}
          </div>
          <div>
            <label className="  mb-2 flex items-center gap-2">
              <span className="text-blue-500">
                <FaUser />
              </span>
              Vendor / Operator Last Name
            </label>
            <input
              type="text"
              name="vendorLastName"
              onChange={handleChange}
              placeholder="Enter the last word of name"
              className="w-full border border-gray-300 rounded px-4 py-1 font-normal italic "
            />
            {errors.vendorLastName && (
              <p className="text-red-500 text-sm">{errors.vendorLastName}</p>
            )}
          </div>
            <div>
              <label className="  mb-2 flex items-center gap-2">
                <span className="text-blue-500">
                  <FaBuilding />
                </span>
                Corporate Office Name
              </label>
              <input
                type="text"
                name="corporateOffice"
                onChange={handleChange}
                placeholder="Enter office name"
                className="w-full border border-gray-300 rounded px-4  py-1 font-normal italic"
              />
              {errors.corporateOffice && (
                <p className="text-red-500 text-sm">{errors.corporateOffice}</p>
              )}
            </div>
            <div>
              <label className="  mb-2 flex items-center gap-2">
                <span className="text-blue-500">
                  <FaEnvelope />
                </span>
                Email
              </label>
              <input
                type="email"
                name="email"
                onChange={handleChange}
                placeholder="Enter your email address"
                className="w-full border border-gray-300 rounded px-4  py-1 font-normal italic"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>
            <div>
              <label className="  mb-2 flex items-center gap-2">
                <span className="text-blue-500">
                  <FaMapMarkerAlt />
                </span>
                Address Line 1
              </label>
              <input
                type="text"
                name="addressLine1"
                onChange={handleChange}
                placeholder="Enter your address"
                className="w-full border border-gray-300 rounded px-4  py-1 font-normal italic"
              />
              {errors.addressLine1 && (
                <p className="text-red-500 text-sm">{errors.addressLine1}</p>
              )}
            </div>
            <div>
              <label className="  mb-2 flex items-center gap-2">
                <span className="text-blue-500">
                  <FaMapMarkerAlt />
                </span>
                Address Line 2
              </label>
              <input
                type="text"
                name="addressLine2"
                onChange={handleChange}
                placeholder="Enter your address"
                className="w-full border border-gray-300 rounded px-4  py-1 font-normal italic"
              />
              {errors.addressLine2 && (
                <p className="text-red-500 text-sm">{errors.addressLine2}</p>
              )}
            </div>
            <div>
              <label className="  mb-2 flex items-center gap-2">
                <span className="text-blue-500">
                  <FaCity />
                </span>
                City
              </label>
              <input
                type="text"
                name="city"
                onChange={handleChange}
                placeholder="Enter your city"
                className="w-full border border-gray-300 rounded px-4  py-1 font-normal italic"
              />
              {errors.city && (
                <p className="text-red-500 text-sm">{errors.city}</p>
              )}
            </div>
            <div>
              <label className="  mb-2 flex items-center gap-2">
                <span className="text-blue-500">
                  <FaMap />
                </span>
                State
              </label>
              <input
                type="text"
                name="state"
                onChange={handleChange}
                placeholder="Enter your state"
                className="w-full border border-gray-300 rounded px-4  py-1 font-normal italic"
              />
              {errors.state && (
                <p className="text-red-500 text-sm">{errors.state}</p>
              )}
            </div>
            <div>
              <label className="  mb-2 flex items-center gap-2">
                <span className="text-blue-500">
                  <FaMapPin />
                </span>
                Zip Code
              </label>
              <input
                type="text"
                name="zipCode"
                onChange={handleChange}
                placeholder="Enter your zip-code"
                className="w-full border border-gray-300 rounded px-4  py-1 font-normal italic"
              />
              {errors.zipCode && (
                <p className="text-red-500 text-sm">{errors.zipCode}</p>
              )}
            </div>
            <div>
              <label className="  mb-2 flex items-center gap-2">
                <span className="text-blue-500">
                  <FaGlobe />
                </span>
                Operations Coverage
              </label>
              <select
                name="operationsCoverage"
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-4  py-1"
              >
                <option value="">Select</option>
                <option value="local">Local</option>
                <option value="national">National</option>
                <option value="international">International</option>
              </select>
              {errors.operationsCoverage && (
                <p className="text-red-500 text-sm">{errors.operationsCoverage}</p>
              )}
            </div>
            <div>
              <label className="  mb-2 flex items-center gap-2">
                <span className="text-blue-500">
                  <FaPhone />
                </span>
                Primary Phone
              </label>
              <input
                type="tel"
                name="primaryPhone"
                onChange={handleChange}
                placeholder="Enter your primary phone number"
                className="w-full border border-gray-300 rounded px-4  py-1 font-normal italic"
              />
              {errors.primaryPhone && (
                <p className="text-red-500 text-sm">{errors.primaryPhone}</p>
              )}
            </div>
            <div>
              <label className="  mb-2 flex items-center gap-2">
                <span className="text-blue-500">
                  <FaPhoneAlt />
                </span>
                Additional Phone No.
              </label>
              <input
                type="tel"
                name="additionalPhone1"
                onChange={handleChange}
                placeholder="Enter your additional phone number"
                className="w-full border border-gray-300 rounded px-4  py-1 font-normal italic"
              />
              {errors.additionalPhone1 && (
                <p className="text-red-500 text-sm">{errors.additionalPhone1}</p>
              )}
            </div>
          </div>
        </fieldset>

        {/* Social Links */}
       <fieldset className="border-2 border-gray-500 rounded p-4">
          <legend className="font-semibold text-xl">Social Links</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div>
              <label className="  mb-2 flex items-center gap-2">
                <span className="text-blue-500">
                  <FaFacebook />
                </span>
                Facebook
              </label>
              <input
                type="text"
                name="facebook"
                onChange={handleChange}
                placeholder="Enter your facebook account link"
                className="w-full border border-gray-300 rounded px-4  py-1 font-normal italic"
              />
              {errors.facebook && (
                <p className="text-red-500 text-sm">{errors.facebook}</p>
              )}
            </div>
            <div>
              <label className="  mb-2 flex items-center gap-2">
                <span className="text-blue-500">
                  <FaInstagram />
                </span>
                Instagram
              </label>
              <input
                type="text"
                name="instagram"
                onChange={handleChange}
                placeholder="Enter your instagram account link"
                className="w-full border border-gray-300 rounded px-4  py-1 font-normal italic"
              />
              {errors.instagram && (
                <p className="text-red-500 text-sm">{errors.instagram}</p>
              )}
            </div>
            <div>
              <label className="  mb-2 flex items-center gap-2">
                <span className="text-blue-500">
                  <FaTwitter />
                </span>
               X / Twitter
              </label>
              <input
                type="text"
                name="twitter"
                onChange={handleChange}
                placeholder="Enter your Twitter / X account link"
                className="w-full border border-gray-300 rounded px-4  py-1 font-normal italic"
              />
              {errors.twitter && (
                <p className="text-red-500 text-sm">{errors.twitter}</p>
              )}
            </div>
            <div>
              <label className="  mb-2 flex items-center gap-2">
                <span className="text-blue-500">
                  <FaWhatsapp />
                </span>
                WhatsApp
              </label>
              <input
                type="tel"
                name="whatsapp"
                onChange={handleChange}
                placeholder="Enter your official whatsapp no."
                className="w-full border border-gray-300 rounded px-4  py-1 font-normal italic"
              />
              {errors.whatsapp && (
                <p className="text-red-500 text-sm">{errors.whatsapp}</p>
              )}
            </div>
          </div>
        </fieldset>
        <div className="">
          <label className="block mb-2 font-semibold">
            Do you have another branch in any country?
          </label>
          <div className="flex gap-4">
            <label>
              <input
                type="radio"
                name="hasBranches"
                value="yes"
                onChange={() => setHasBranches(true)}
              />{" "}
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="hasBranches"
                value="no"
                onChange={() => {
                  setHasBranches(false);
                  setBranches([{ branchId: 1 }]); // Reset branches
                }}
              />{" "}
              No
            </label>
          </div>
        </div>

        {hasBranches &&
          branches.map((branch, index) => (
            <fieldset key={index} className="border-2 border-gray-500 rounded p-4">
              <legend className="font-semibold text-xl">Branch {index + 1}</legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2">Department Name</label>
                  <input
                    type="text"
                    name={`departmentName_${index}`}
                    className="w-full border border-gray-300 rounded px-4  py-1 font-normal italic"
                    onChange={handleChange}
                    placeholder="Enter your department name"
                  />
                  {errors[`departmentName_${index}`] && (
                    <p className="text-red-500 text-sm">
                      {errors[`departmentName_${index}`]}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block mb-2">Contact No</label>
                  <input
                    type="text"
                    name={`contactNo_${index}`}
                    className="w-full border border-gray-300 rounded px-4  py-1 font-normal italic"
                    onChange={handleChange}
                    placeholder="Enter your official contact no"
                  />
                  {errors[`contactNo_${index}`] && (
                    <p className="text-red-500 text-sm">{errors[`contactNo_${index}`]}</p>
                  )}
                </div>
                <div>
                  <label className="block mb-2">Email</label>
                  <input
                    type="email"
                    name={`email_${index}`}
                    className="w-full border border-gray-300 rounded px-4  py-1 font-normal italic"
                    onChange={handleChange}
                    placeholder="Enter your email address"
                  />
                  {errors[`email_${index}`] && (
                    <p className="text-red-500 text-sm">{errors[`email_${index}`]}</p>
                  )}
                </div>

                <div>
                  <label className="block mb-2">Upload Your Photo</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      name={`photo_${index}`}
                      className="border border-gray-300 rounded px-4  py-1 w-full"
                      onChange={handleChange}
                      
                    />
                    <FaUpload className="text-gray-500" />
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="block mb-2">Address Line 1</label>
                  <input
                    type="text"
                    name={`addressLine1_${index}`}
                    className="w-full border border-gray-300 rounded px-4  py-1 font-normal italic"
                    onChange={handleChange}
                    placeholder="Enter your address"
                  />
                </div>t5
                <div className="col-span-2">
                  <label className="block mb-2">Address Line 2</label>
                  <input
                    type="text"
                    name={`addressLine2_${index}`}
                    className="w-full border border-gray-300 rounded px-4  py-1 font-normal italic"
                    onChange={handleChange}
                    placeholder="Enter your address"
                  />
                </div>

               

              </div>
              <div className="grid grid-cols-3 gap-4 mt-2">
                  <div>
                    <label className="block mb-2">City</label>
                    <input
                      type="text"
                      name={`city_${index}`}
                      className="w-full border border-gray-300 rounded px-4  py-1 font-normal italic"
                      onChange={handleChange}
                      placeholder="Enter your city"
                    />
                  </div>
                  <div>
                    <label className="block mb-2">State</label>
                    <input
                      type="text"
                      name={`state_${index}`}
                      className="w-full border border-gray-300 rounded px-4  py-1 font-normal italic"
                      onChange={handleChange}
                      placeholder="Enter your state"
                    />
                  </div>
                  <div>
                    <label className="block mb-2">Zip Code</label>
                    <input
                      type="text"
                      name={`zipCode_${index}`}
                      className="w-full border border-gray-300 rounded px-4  py-1 font-normal italic"
                      onChange={handleChange}
                      placeholder="Enter your zip code"
                    />
                  </div>
                </div>
            </fieldset>
          ))}

        {hasBranches && (
          <button
            type="button"
            onClick={addBranch}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Another Branch
          </button>
        )}

        <div className="text-right">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      </form>
    </div>

  );
}
