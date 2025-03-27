"use client";
import { useState, useEffect } from "react";
import { FaVideo, FaImage } from "react-icons/fa";
import Link from "next/link";

// Helper function: read a File as base64, then POST to your S3 API.
async function uploadToS3(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        // Remove the data: prefix
        const base64Content = reader.result.split(",")[1];
        const response = await fetch(
          "https://3k5q9gfaak.execute-api.ap-south-1.amazonaws.com/v1/upload",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              directory: "AircraftGallery",
              file: base64Content,
              filename: file.name,
              contentType: file.type,
            }),
          }
        );
        const data = await response.json();

        if (!response.ok) {
          return reject(data.error || "Upload failed");
        }
        // data.url should be the final S3 link
        resolve(data.url);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ImageGallery() {
  /**
   * `images` now only stores s3Url strings.
   * No isUploading or extra props inside your data.
   */
  const [images, setImages] = useState({
    exterior: {
      "Front View": "",
      "Left View": "",
      "Rear View": "",
      "Right View": "",
    },
    interior: {
      "Front View": "",
      "Left View": "",
      "Rear View": "",
      "Right View": "",
    },
    cockpit: {
      "Front View": "",
      "Left View": "",
      "Rear View": "",
      "Right View": "",
    },
    aircraftLayout: {
      Day: "",
      Night: "",
    },
    video: "",
  });

  /**
   * A separate local state to track uploading status
   *  e.g. uploadingMap["exterior-Front View"] = true | false
   */
  const [uploadingMap, setUploadingMap] = useState({});

  // On mount, hydrate from sessionStorage if we have previously saved data
  useEffect(() => {
    const savedData = sessionStorage.getItem("formData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      if (parsedData.aircraftGallery) {
        setImages(parsedData.aircraftGallery);
      }
    }
  }, []);

  // Helper to keep images & sessionStorage in sync
  function updateImages(newState) {
    setImages(newState);
    const savedData = sessionStorage.getItem("formData");
    const parsedData = savedData ? JSON.parse(savedData) : {};
    sessionStorage.setItem(
      "formData",
      JSON.stringify({
        ...parsedData,
        aircraftGallery: newState,
      })
    );
  }

  // Helper to mark a tile as uploading or not
  function setTileUploading(sectionKey, view, isUploading) {
    const mapKey = `${sectionKey}-${view}`;
    setUploadingMap((prev) => ({
      ...prev,
      [mapKey]: isUploading,
    }));
  }

  // Checks if a tile is uploading from uploadingMap
  function isTileUploading(sectionKey, view) {
    const mapKey = `${sectionKey}-${view}`;
    return uploadingMap[mapKey] === true;
  }

  // =========== MAIN UPLOAD HANDLER ==============
  async function handleFile(file, section, view) {
    if (!file) return;

    // Mark isUploading = true in uploadingMap
    setTileUploading(section, view, true);

    try {
      // Upload to S3
      const s3Url = await uploadToS3(file);

      // Update the final S3 URL in images state
      updateImages((prev) => {
        const newState = structuredClone(prev);
        if (section === "video") {
          newState.video = s3Url;
        } else {
          newState[section][view] = s3Url;
        }
        return newState;
      });
    } catch (err) {
      console.error("Upload failed:", err);
      alert("File upload failed. Please try again.");
    } finally {
      // Mark isUploading = false
      setTileUploading(section, view, false);
    }
  }

  // On change from file input
  function handleUpload(e, section, view) {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file, section, view);
    }
  }

  // DRAG & DROP
  function handleDragOver(e) {
    e.preventDefault();
  }

  function handleDrop(e, section, view) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file, section, view);
    }
  }

  // "Next" button
  const handleNext = () => {
    const savedData = sessionStorage.getItem("formData");
    const formData = savedData ? JSON.parse(savedData) : {};
    const updatedFormData = {
      ...formData,
      aircraftGallery: images,
    };
    sessionStorage.setItem("formData", JSON.stringify(updatedFormData));
  };

  // RENDER a single "tile"
  function renderTile(sectionKey, viewLabel) {
    // If sectionKey === "video", we interpret images.video as the s3Url
    const s3Url =
      sectionKey === "video"
        ? images.video
        : images[sectionKey]?.[viewLabel] ?? "";

    const isVideo = sectionKey === "video";
    const uploading = isTileUploading(sectionKey, viewLabel);

    // Preview: if s3Url is present, show <img> or <video>
    let previewElement = null;
    if (s3Url) {
      if (isVideo) {
        previewElement = (
          <video
            src={s3Url || " "}
            controls
            className="w-full h-full rounded-xl object-cover"
          />
        );
      } else {
        previewElement = (
          <img
            src={s3Url || " "}
            alt={viewLabel}
            className="w-full h-full object-cover rounded-xl"
          />
        );
      }
    } else {
      // Show placeholder icon
      previewElement = isVideo ? (
        <div className="text-center flex flex-col items-center">
          <FaVideo className="w-16 h-16 text-gray-400 group-hover:text-indigo-500 transition-colors" />
          <p className="mt-3 text-sm text-gray-500">
            Upload {sectionKey === "video" ? "Aircraft Video" : viewLabel}
          </p>
        </div>
      ) : (
        <div className="text-center flex flex-col items-center">
          <FaImage className="w-16 h-16 text-gray-400 group-hover:text-indigo-500 transition-colors" />
          <p className="mt-3 text-sm text-gray-500">Upload {viewLabel}</p>
        </div>
      );
    }

    return (
      <div
        key={viewLabel}
        className={`relative group flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl h-60 
          bg-gradient-to-tr from-gray-50 to-gray-100 hover:border-indigo-500 
          hover:from-indigo-50 hover:to-indigo-100 hover:scale-105 transition-all duration-300
        `}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, sectionKey, viewLabel)}
      >
        <label
          htmlFor={`${sectionKey}-${viewLabel}`}
          className="cursor-pointer absolute inset-0 flex items-center justify-center"
        >
          {previewElement}
        </label>

        {/* Overlaid "Uploading..." with spinner, stored in separate state */}
        {uploading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white bg-opacity-50">
            {/* Simple spinner SVG */}
            <svg
              className="animate-spin h-8 w-8 text-indigo-600 mb-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
            <p className="text-indigo-700 font-medium">Uploading...</p>
          </div>
        )}

        {/* Hidden file input */}
        <input
          type="file"
          accept={isVideo ? "video/*" : "image/*"}
          className="hidden"
          id={`${sectionKey}-${viewLabel}`}
          onChange={(e) => handleUpload(e, sectionKey, viewLabel)}
        />

        {/* If we have a final S3 link, also show it as text (not mandatory) */}
        {!uploading && s3Url && (
          <p className="absolute bottom-1 left-1 right-1 text-xs text-green-700 bg-white bg-opacity-70 p-1 rounded">
            {s3Url}
          </p>
        )}
      </div>
    );
  }

  // RENDER a "section" with multiple tiles
  function renderUploadSection(
    sectionTitle,
    sectionKey,
    views = ["Front View", "Left View", "Rear View", "Right View"]
  ) {
    // If "video", just one tile
    if (sectionKey === "video") {
      return (
        <div className="border border-transparent rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-indigo-50 to-indigo-100 p-8 transition-all duration-300 hover:shadow-3xl hover:from-indigo-100 hover:to-white">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">
            {sectionTitle}
          </h2>
          <div className="relative group flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl h-72 bg-gradient-to-tr from-gray-50 to-gray-100 hover:border-indigo-500 hover:from-indigo-50 hover:to-indigo-100 hover:scale-105 transition-all duration-300">
            {renderTile("video", "video")}
          </div>
        </div>
      );
    }

    return (
      <div className="border border-transparent rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-indigo-50 to-indigo-100 p-8 transition-all duration-300 hover:shadow-3xl hover:from-indigo-100 hover:to-white">
        <h2 className="text-3xl font-bold mb-8 text-gray-900 tracking-wide">
          {sectionTitle}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {views.map((view) => renderTile(sectionKey, view))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-6 max-w-5xl">
      <h1 className="text-5xl font-extrabold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
        Upload Aircraft Media
      </h1>

      <div className="space-y-16">
        {renderUploadSection("Exterior View", "exterior")}
        {renderUploadSection("Interior View", "interior")}
        {renderUploadSection("Cockpit View", "cockpit")}
        {renderUploadSection("Aircraft Layout (Day / Night)", "aircraftLayout", [
          "Day",
          "Night",
        ])}
        {renderUploadSection("Aircraft Video", "video")}
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
          onClick={handleNext}
        >
          Next
        </Link>
      </div>
    </div>
  );
}
