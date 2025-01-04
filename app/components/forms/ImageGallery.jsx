"use client";
import { useState } from "react";
import { FaVideo, FaImage } from "react-icons/fa";
import Link from "next/link";

const ImageGallery = () => {
  const [images, setImages] = useState({
    exterior: {},
    interior: {},
    cockpit: {},
    video: null,
  });

  const handleUpload = (e, section, view) => {
    const file = e.target.files[0];
    if (file) {
      setImages((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [view]: URL.createObjectURL(file),
        },
      }));
    }
  };

  const renderUploadSection = (sectionTitle, sectionKey) => (
    <div className="border border-transparent rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-indigo-50 to-indigo-100 p-8 transition-all duration-300 hover:shadow-3xl hover:from-indigo-100 hover:to-white">
      <h2 className="text-3xl font-bold mb-8 text-gray-900 tracking-wide">
        {sectionTitle}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {["Front View", "Left View", "Rear View", "Right View"].map((view) => (
          <div
            key={view}
            className="relative group flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl h-60 bg-gradient-to-tr from-gray-50 to-gray-100 hover:border-indigo-500 hover:from-indigo-50 hover:to-indigo-100 hover:scale-105 transition-all duration-300"
          >
            <label
              htmlFor={`${sectionKey}-${view}`}
              className="cursor-pointer absolute inset-0 flex items-center justify-center"
            >
              {images[sectionKey][view] ? (
                <img
                  src={images[sectionKey][view]}
                  alt={view}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <div className="text-center flex flex-col items-center">
                  <FaImage className="w-16 h-16 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                  <p className="mt-3 text-sm text-gray-500">
                    Upload {view}
                  </p>
                </div>
              )}
            </label>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id={`${sectionKey}-${view}`}
              onChange={(e) => handleUpload(e, sectionKey, view)}
            />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto py-12 px-6 max-w-5xl">
      <h1 className="text-5xl font-extrabold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
        Upload Aircraft Media
      </h1>

      <div className="space-y-16">
        {renderUploadSection("Exterior View", "exterior")}
        {renderUploadSection("Interior View", "interior")}
        {renderUploadSection("Cockpit View", "cockpit")}

        <div className="border border-transparent rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-indigo-50 to-indigo-100 p-8 hover:shadow-3xl hover:from-indigo-100 hover:to-white transition-all duration-300">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">
            Aircraft Video
          </h2>
          <div className="relative group flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl h-72 bg-gradient-to-tr from-gray-50 to-gray-100 hover:border-indigo-500 hover:from-indigo-50 hover:to-indigo-100 hover:scale-y-105 transition-all duration-300">
            {images.video ? (
              <video
                src={images.video}
                controls
                className="w-full h-full rounded-xl object-cover"
              />
            ) : (
              <label
                htmlFor="aircraft-video"
                className="cursor-pointer flex flex-col items-center justify-center"
              >
                <FaVideo className="w-20 h-20 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                <p className="mt-4 text-sm text-gray-500">
                  Upload Aircraft Video
                </p>
              </label>
            )}
            <input
              type="file"
              accept="video/*"
              className="hidden"
              id="aircraft-video"
              onChange={(e) =>
                setImages((prev) => ({
                  ...prev,
                  video: URL.createObjectURL(e.target.files[0]),
                }))
              }
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-16">
        <Link
          href={"/fleetRegistration"}
          className="px-8 py-3 rounded-lg bg-gradient-to-r from-red-400 to-red-500 text-white font-semibold shadow-lg hover:scale-105 transition-transform"
        >
          Back
        </Link>
        <Link
          href={"/fleetRegistration/travelModes"}
          className="px-8 py-3 rounded-lg bg-gradient-to-r from-green-400 to-green-500 text-white font-semibold shadow-lg hover:scale-110 transition-transform"
        >
          Next
        </Link>
      </div>
    </div>
  );
};

export default ImageGallery;
