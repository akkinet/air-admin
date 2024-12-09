"use client";

import React, { useState, useEffect } from "react";
import {
  FaChartLine,
  FaUserShield,
  FaPlane,
  FaUsers,
  FaBuilding,
  FaBriefcase,
  FaStore,
  FaBox,
  FaCogs,
  FaMapMarkerAlt,
  FaCouch,
  FaArrowsAltV,
  FaPlaneDeparture,
} from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Sidebar = () => {
  const [activeComponent, setActiveComponent] = useState("dashboard");
  const router = useRouter();

  useEffect(() => {
    if (router && router.pathname) {
      const currentPath = router.pathname.slice(1) || "dashboard";
      setActiveComponent(currentPath);
    }
  }, [router]);

  const handleSetActive = (component) => {
    setActiveComponent(component);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="bg-gray-900 text-white p-4 shadow-lg flex flex-col w-64">
        <div className="mb-8">
          <img
            className="h-14 mx-auto"
            src="https://s3.ap-south-1.amazonaws.com/medicom.hexerve/jkare-2.png"
            alt="Logo"
          />
        </div>
        <ul className="space-y-2">
          <li>
            <Link
              href="/"
              className={`flex items-center p-2 rounded-md ${
                activeComponent === "dashboard"
                  ? "bg-purple-600 text-white"
                  : "text-gray-400"
              } hover:bg-purple-500 hover:text-white`}
              onClick={() => handleSetActive("dashboard")}
            >
              <FaChartLine className="text-lg" />
              <span className="ml-3">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              href="dashboard/aircrafts"
              className={`flex items-center p-2 rounded-md ${
                activeComponent === "aircrafts"
                  ? "bg-purple-600 text-white"
                  : "text-gray-400"
              } hover:bg-purple-500 hover:text-white`}
              onClick={() => handleSetActive("aircrafts")}
            >
              <FaPlane className="text-lg" />
              <span className="ml-3">Aircrafts</span>
            </Link>
          </li>
          <li>
            <Link
              href="/users"
              className={`flex items-center p-2 rounded-md ${
                activeComponent === "users"
                  ? "bg-purple-600 text-white"
                  : "text-gray-400"
              } hover:bg-purple-500 hover:text-white`}
              onClick={() => handleSetActive("users")}
            >
              <FaUsers className="text-lg" />
              <span className="ml-3">Users</span>
            </Link>
          </li>
          <li>
            <Link
              href="/departments"
              className={`flex items-center p-2 rounded-md ${
                activeComponent === "departments"
                  ? "bg-purple-600 text-white"
                  : "text-gray-400"
              } hover:bg-purple-500 hover:text-white`}
              onClick={() => handleSetActive("departments")}
            >
              <FaBuilding className="text-lg" />
              <span className="ml-3">Departments</span>
            </Link>
          </li>
          <li>
            <Link
              href="/services"
              className={`flex items-center p-2 rounded-md ${
                activeComponent === "services"
                  ? "bg-purple-600 text-white"
                  : "text-gray-400"
              } hover:bg-purple-500 hover:text-white`}
              onClick={() => handleSetActive("services")}
            >
              <FaBriefcase className="text-lg" />
              <span className="ml-3">Services</span>
            </Link>
          </li>
          <li>
            <Link
              href="/aircraft-vendors"
              className={`flex items-center p-2 rounded-md ${
                activeComponent === "aircraft-vendors"
                  ? "bg-purple-600 text-white"
                  : "text-gray-400"
              } hover:bg-purple-500 hover:text-white`}
              onClick={() => handleSetActive("aircraft-vendors")}
            >
              <FaStore className="text-lg" />
              <span className="ml-3">Aircraft Vendors</span>
            </Link>
          </li>
          <li>
            <Link
              href="/vendor-branches"
              className={`flex items-center p-2 rounded-md ${
                activeComponent === "vendor-branches"
                  ? "bg-purple-600 text-white"
                  : "text-gray-400"
              } hover:bg-purple-500 hover:text-white`}
              onClick={() => handleSetActive("vendor-branches")}
            >
              <FaBox className="text-lg" />
              <span className="ml-3">Vendor Branches</span>
            </Link>
          </li>
          <li>
            <Link
              href="dashboard/aircraftModels"
              className={`flex items-center p-2 rounded-md ${
                activeComponent === "aircraftModels"
                  ? "bg-purple-600 text-white"
                  : "text-gray-400"
              } hover:bg-purple-500 hover:text-white`}
              onClick={() => handleSetActive("aircraftModels")}
            >
              <FaPlane className="text-lg" />
              <span className="ml-3">Aircraft Models</span>
            </Link>
          </li>
          <li>
            <Link
              href="/aircraft-types"
              className={`flex items-center p-2 rounded-md ${
                activeComponent === "aircraft-types"
                  ? "bg-purple-600 text-white"
                  : "text-gray-400"
              } hover:bg-purple-500 hover:text-white`}
              onClick={() => handleSetActive("aircraft-types")}
            >
              <FaPlaneDeparture className="text-lg" />
              <span className="ml-3">Aircraft Types</span>
            </Link>
          </li>
          <li>
            <Link
              href="/aircraft-bases"
              className={`flex items-center p-2 rounded-md ${
                activeComponent === "aircraft-bases"
                  ? "bg-purple-600 text-white"
                  : "text-gray-400"
              } hover:bg-purple-500 hover:text-white`}
              onClick={() => handleSetActive("aircraft-bases")}
            >
              <FaMapMarkerAlt className="text-lg" />
              <span className="ml-3">Aircraft Bases</span>
            </Link>
          </li>
          <li>
            <Link
              href="/aircraft-seat-modes"
              className={`flex items-center p-2 rounded-md ${
                activeComponent === "aircraft-seat-modes"
                  ? "bg-purple-600 text-white"
                  : "text-gray-400"
              } hover:bg-purple-500 hover:text-white`}
              onClick={() => handleSetActive("aircraft-seat-modes")}
            >
              <FaCouch className="text-lg" />
              <span className="ml-3">Aircraft Seat Modes</span>
            </Link>
          </li>
          <li>
            <Link
              href="/aircraft-cabin-heights"
              className={`flex items-center p-2 rounded-md ${
                activeComponent === "aircraft-cabin-heights"
                  ? "bg-purple-600 text-white"
                  : "text-gray-400"
              } hover:bg-purple-500 hover:text-white`}
              onClick={() => handleSetActive("aircraft-cabin-heights")}
            >
              <FaArrowsAltV className="text-lg" />
              <span className="ml-3">Aircraft Cabin Heights</span>
            </Link>
          </li>
          <li>
            <Link
              href="/settings"
              className={`flex items-center p-2 rounded-md ${
                activeComponent === "settings"
                  ? "bg-purple-600 text-white"
                  : "text-gray-400"
              } hover:bg-purple-500 hover:text-white`}
              onClick={() => handleSetActive("settings")}
            >
              <FaCogs className="text-lg" />
              <span className="ml-3">Settings</span>
            </Link>
          </li>
          {/* <li>
            <Link
              href="/app-versions"
              className={`flex items-center p-2 rounded-md ${
                activeComponent === "app-versions"
                  ? "bg-purple-600 text-white"
                  : "text-gray-400"
              } hover:bg-purple-500 hover:text-white`}
              onClick={() => handleSetActive("app-versions")}
            >
              <FaCogs className="text-lg" />
              <span className="ml-3">App Versions</span>
            </Link>
          </li> */}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
