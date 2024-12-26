import React from "react";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaSnapchat,
  FaTwitter,
  FaWhatsapp,
} from "react-icons/fa";

export default function SocialLinks({ prefix = "", handleChange, errors }) {
  const platforms = [
    { name: "facebook", icon: FaFacebook },
    { name: "instagram", icon: FaInstagram },
    { name: "linkedin", icon: FaLinkedin },
    { name: "twitter", icon: FaTwitter },
    { name: "snapchat", icon: FaSnapchat },
    { name: "whatsapp", icon: FaWhatsapp },
  ];

  return (
    <fieldset className="border-2 border-gray-400 rounded p-4 mt-4">
      <legend className="font-semibold text-lg">Social Links</legend>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        {platforms.map(({ name, icon: Icon }) => (
          <div key={name}>
            <label className="mb-2 flex items-center gap-2">
              <span className="text-blue-500">
                <Icon />
              </span>
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </label>
            <input
              type={name === "whatsapp" ? "tel" : "text"}
              name={`${prefix}${name}`}  // Ensure proper prefixing
              onChange={handleChange}
              placeholder={`Enter ${name} link`}
              className="w-full border border-gray-300 rounded px-4 py-1"
            />
            {errors[`${prefix}${name}`] && (
              <p className="text-red-500 text-sm">
                {errors[`${prefix}${name}`]}
              </p>
            )}
          </div>
        ))}
      </div>
    </fieldset>
  );
}
