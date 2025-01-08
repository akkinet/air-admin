"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
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

  const filteredModules = [
    // { path: "/", label: "Dashboard", icon: FaChartLine },
  ];

  // only for admin department 
  const allModules = [
    { path: "/", label: "Dashboard", icon: FaChartLine },
    { path: "/aircrafts", label: "Aircrafts", icon: FaPlane },
    { path: "/users", label: "Users", icon: FaUsers },
    { path: "/cognitoForm", label: "Aircraft Listing", icon: FaBuilding },
    // { path: "/aircraftVendors", label: "Aircraft Vendors", icon: FaStore },
    { path: "/vendorsTable", label: "Vendors List", icon: FaBox },
    { path: "/aircraftModels", label: "Aircraft Models", icon: FaPlane },
    { path: "/aircraft-types", label: "Aircraft Types", icon: FaPlaneDeparture },
    // { path: "/aircraftBases", label: "Aircraft Bases", icon: FaMapMarkerAlt },
    { path: "/aircraft-seat-modes", label: "Aircraft Seat Modes", icon: FaCouch },
    { path: "/fleetRegistration", label: "Fleet Registration form", icon: FaCouch },
  ];

  // only for  verified and registered vendors
  if (session?.user?.isVendorRegistered && session?.user?.isVerified) {
    filteredModules.push({ path: "/fleetRegistration", label: "Fleet Registration form", icon: FaCouch });
  }

  const modulesToRender = session?.provider === "credentials" ? allModules : filteredModules;

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

        <header className="relative flex flex-col justify-between p-2 bg-white shadow-md rounded-md space-y-2 mb-2">
          {session && (
            <div className="flex items-center space-x-4 border-b-2 border-red-500 pb-2">
              {/* User Avatar */}
              <Image
                className="rounded-full object-cover flex-shrink-0"
                src={session.user.image}
                alt="User Avatar"
                width={34}
                height={34}
                style={{
                  width: '34px',
                  height: '34px',
                }}
              />

              {/* Provider Login Text */}
              <div>
                <p className="text-sm text-gray-800">
                  Login via {session.provider}
                </p>
              </div>
            </div>
          )}

          {session && (
            <div className="flex flex-col items-start">
              {/* Welcome Text */}
              <p className="text-black font-semibold">Welcome,</p>
              <p className="text-sm text-gray-600 truncate max-w-[250px] text-center">
                {session.user.email}
              </p>
            </div>
          )}

          {/* Logout Button */}
          <div className="flex justify-center">
            <Link
              href="/api/auth/signout"
              className="flex items-center text-black hover:text-red-500 space-x-2"
            >
              <IoIosLogOut size={20} />
              <span className="text-sm font-medium">Sign Out</span>
            </Link>
          </div>
        </header>

        <ul className="space-y-2">
          {modulesToRender.map((item, index) => (
            <li key={index}>
              <Link
                href={item.path}
                className={`flex items-center p-2 rounded-md ${activeComponent === item.path.slice(1)
                  ? "bg-purple-600 text-white"
                  : "text-gray-400"
                  } hover:bg-purple-500 hover:text-white`}
                onClick={() => handleSetActive(item.path.slice(1))}
              >
                <item.icon className="text-lg" />
                <span className="ml-3">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
