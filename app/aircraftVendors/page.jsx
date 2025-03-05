"use client";
import { useState, useEffect } from "react";
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaBuilding,
  FaMapMarkerAlt,
  FaCity,
  FaMap,
  FaMapPin,
  FaGlobe,
  FaPhoneAlt,
  FaUpload,

} from "react-icons/fa";
import SocialLinks from "../components/SocialLinks";
import { useSession } from "next-auth/react";



export default function BusinessInformationForm() {
  const { data: session } = useSession();


  const [formData, setFormData] = useState({
    corporateName: "",
    email: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    firstName: "",
    lastName: "",
    operationCoverage: "",
    operationsType: [],
    phone: "",
    baseCountry: "India",
    additionalPhone: "",
    additionalPhone2: "",
    socialLinks: [],
    contactPreference: "phone",
    businessDescription: "",
  });

  const [errors, setErrors] = useState({});
  const [branches, setBranches] = useState([{ branchId: 1, file: null, socialLinks: [] }]);

  const [hasBranches, setHasBranches] = useState(false);  // Default to "No"


  const addBranch = () => {
    setBranches([...branches, { branchId: branches.length + 1, file: null, socialLinks: [] }]);
  };
  useEffect(() => {
    if (session?.user?.email) {
      setFormData(prev => ({ ...prev, email: session.user.email }));
    }
  }, [session]);

  const handleFileChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const updatedBranches = [...branches];
        updatedBranches[index] = {
          ...updatedBranches[index],
          file: {
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
            filePreview: reader.result,
          },
        };

        setBranches(updatedBranches);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleDeleteBranch = (index) => {
    const updatedBranches = branches.filter((_, i) => i !== index);
    setBranches(updatedBranches);
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
        case "phone":
        case "additionalPhone":
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

    const branchRegex = /^(\d+)_(\w+)$/;
    const match = name.match(branchRegex);

    if (match) {
      const branchIndex = parseInt(match[1], 10);
      const field = match[2];

      const updatedBranches = [...branches];

      // Ensure branch exists
      if (!updatedBranches[branchIndex]) {
        updatedBranches[branchIndex] = { socialLinks: [] };
      }

      // Ensure socialLinks array is initialized
      if (!updatedBranches[branchIndex].socialLinks) {
        updatedBranches[branchIndex].socialLinks = [];
      }

      // Handle social links dynamically
      if (["facebook", "instagram", "linkedin", "whatsapp", "snapchat", "twitter"].includes(field)) {
        const existingLinkIndex = updatedBranches[branchIndex].socialLinks.findIndex(
          (link) => link.type === field
        );

        if (existingLinkIndex > -1) {
          updatedBranches[branchIndex].socialLinks[existingLinkIndex].value = value;
        } else {
          updatedBranches[branchIndex].socialLinks.push({ type: field, value });
        }
      } else {
        // ✅ Update non-social link fields without overwriting
        updatedBranches[branchIndex][field] = value;
      }

      setBranches(updatedBranches);
    } else {
      // Main form fields
      if (type === "checkbox") {
        setFormData((prev) => ({
          ...prev,
          operationsType: checked
            ? [...prev.operationsType, value]
            : prev.operationsType.filter((item) => item !== value),
        }));
      }
      // Handle main form social links
      else if (["facebook", "instagram", "linkedin", "whatsapp", "snapchat", "twitter"].includes(name)) {
        setFormData((prev) => {
          const socialLinks = prev.socialLinks.filter((link) => link.type !== name);
          if (value) {
            socialLinks.push({ type: name, value });
          }
          return { ...prev, socialLinks };
        });
      } else {
        // Regular main form fields
        const error = validateField(name, value);
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    const missingFields = [];

    // Validate main form fields
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        missingFields.push(key);
      }
    });

    // Validate branches
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
      const dataToSend = {
        ...formData,
        branches: branches.map((branch, index) => {
          const branchFields = {};

          // Extract dynamic branch fields from formData
          Object.keys(formData).forEach((key) => {
            if (key.endsWith(`_${index}`)) {
              const fieldName = key.split("_")[0];
              branchFields[fieldName] = formData[key];
            }
          });

          return {
            ...branch,
            ...branchFields,  // Merge the extracted fields into the branch object
            socialLinks: branch.socialLinks || [],
          };
        }),
      };

      console.log("Payload to Send:", dataToSend);

      fetch("http://localhost:3000/api/vendor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to submit form");
          }
          return response.json();
        })
        .then((data) => {
          alert("Form submitted successfully!");
          window.location.href = "/dashboard";
        })
        .catch((error) => {
          alert("Failed to submit form. Please try again.");
        });
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
                name="firstName"
                onChange={handleChange}
                placeholder="Enter the first word of name"
                className="w-full border border-gray-300 rounded px-4 py-1 font-normal italic"
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm">{errors.firstName}</p>
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
                name="lastName"
                onChange={handleChange}
                placeholder="Enter the last word of name"
                className="w-full border border-gray-300 rounded px-4 py-1 font-normal italic "
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm">{errors.lastName}</p>
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
                name="corporateName"
                onChange={handleChange}
                placeholder="Enter office name"
                className="w-full border border-gray-300 rounded px-4  py-1 font-normal italic"
              />
              {errors.corporateName && (
                <p className="text-red-500 text-sm">{errors.corporateName}</p>
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
                value={formData.email}
                readOnly
                className="w-full border border-gray-300 rounded px-4 py-1 font-normal italic"
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
                name="operationCoverage"
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-4  py-1"
              >
                <option value="">Select</option>
                <option value="local">Local</option>
                <option value="national">National</option>
                <option value="international">International</option>
              </select>
              {errors.operationCoverage && (
                <p className="text-red-500 text-sm">{errors.operationCoverage}</p>
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
                name="phone"
                onChange={handleChange}
                placeholder="Enter your primary phone number"
                className="w-full border border-gray-300 rounded px-4  py-1 font-normal italic"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone}</p>
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
                name="additionalPhone"
                onChange={handleChange}
                placeholder="Enter your additional phone number"
                className="w-full border border-gray-300 rounded px-4  py-1 font-normal italic"
              />
              {errors.additionalPhone && (
                <p className="text-red-500 text-sm">{errors.additionalPhone}</p>
              )}
            </div>
          </div>
        </fieldset>

        {/* Social Links */}
        <SocialLinks prefix="" handleChange={handleChange} errors={errors} />



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
                checked={hasBranches}
                onChange={() => setHasBranches(true)}
              /> Yes
              <input
                type="radio"
                name="hasBranches"
                value="no"
                checked={!hasBranches}
                onChange={() => {
                  setHasBranches(false);
                  setBranches([]); // Send empty branches when "No" is selected
                }}
              /> No

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
                      onChange={(e) => handleFileChange(index, e)}
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
                </div>
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
              <SocialLinks
                prefix={`${index}_`}  // Dynamic prefix per branch
                handleChange={handleChange}
                errors={errors}
              />
              <button
                type="button"
                onClick={() => handleDeleteBranch(index)}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete Branch
              </button>
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
