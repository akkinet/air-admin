"use client";

import React, { useState, useEffect } from "react";
import {
  FaChartLine,
  FaPlane,
  FaUsers,
  FaBuilding,
  FaStore,
  FaBox,
  FaMapMarkerAlt,
  FaCouch,
  FaPlaneDeparture,
} from "react-icons/fa";
import { IoIosLogOut } from "react-icons/io";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";


const Sidebar = () => {
  const [activeComponent, setActiveComponent] = useState("dashboard");
  const router = useRouter();
  const { data: session } = useSession();

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
        <div className="mb-4">
          <img
            className="h-18 mx-auto"
            src="https://www.charterflightsaviation.com/images/logo.png"
            alt="Logo"
          />
        </div>

        <header className="flex items-center justify-between px-2 py-2 mb-2 bg-white shadow rounded-md">
          {session && (
            <div className="flex items-center space-x-4">
              <img
                className="w-10 h-10 rounded-full"
                src={session.user.image}
                alt="User Avatar"
              />
              <div>
                <div className="flex justify-between">
                  <p className="text-black">Welcome,</p>
                  <Link href="/api/auth/signout">
                  <IoIosLogOut size={24} className="text-black hover:text-red-500" />
                  </Link>
                </div>
                <p className="text-sm text-gray-600">{session.user.email}</p>
              </div>
            </div>
          )}


        </header>
        <ul className="space-y-2">
          <li>
            <Link
              href="/"
              className={`flex items-center p-2 rounded-md ${activeComponent === "dashboard"
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
              href="/aircrafts"
              className={`flex items-center p-2 rounded-md ${activeComponent === "aircrafts"
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
              className={`flex items-center p-2 rounded-md ${activeComponent === "users"
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
              href="/cognitoForm"
              className={`flex items-center p-2 rounded-md ${activeComponent === "cognitoForm"
                  ? "bg-purple-600 text-white"
                  : "text-gray-400"
                } hover:bg-purple-500 hover:text-white`}
              onClick={() => handleSetActive("cognitoForm")}
            >
              <FaBuilding className="text-lg" />
              <span className="ml-3">Aircraft Listing</span>
            </Link>
          </li>
          <li>
            <Link
              href="/aircraftVendors"
              className={`flex items-center p-2 rounded-md ${activeComponent === "aircraft-vendors"
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
              className={`flex items-center p-2 rounded-md ${activeComponent === "vendor-branches"
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
              href="/aircraftModels"
              className={`flex items-center p-2 rounded-md ${activeComponent === "aircraftModels"
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
              className={`flex items-center p-2 rounded-md ${activeComponent === "aircraft-types"
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
              href="/aircraftBases"
              className={`flex items-center p-2 rounded-md ${activeComponent === "aircraftBases"
                  ? "bg-purple-600 text-white"
                  : "text-gray-400"
                } hover:bg-purple-500 hover:text-white`}
              onClick={() => handleSetActive("aircraftBases")}
            >
              <FaMapMarkerAlt className="text-lg" />
              <span className="ml-3">Aircraft Bases</span>
            </Link>
          </li>
          <li>
            <Link
              href="/aircraft-seat-modes"
              className={`flex items-center p-2 rounded-md ${activeComponent === "aircraft-seat-modes"
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
              href="/fleetRegistration"
              className={`flex items-center p-2 rounded-md ${activeComponent === "fleetRegistration"
                  ? "bg-purple-600 text-white"
                  : "text-gray-400"
                } hover:bg-purple-500 hover:text-white`}
              onClick={() => handleSetActive("fleetRegistration")}
            >
              <FaCouch className="text-lg" />
              <span className="ml-3">Fleet Registration form</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
