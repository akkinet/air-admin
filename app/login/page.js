"use client";
import React, { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { FaGoogle } from "react-icons/fa";

const ResponsiveBackground = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", checkScreenSize);
    checkScreenSize();

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return isMobile;
};

const LoginPage = () => {
  const isMobile = ResponsiveBackground();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signIn("credentials", {
        email,
        password,
        redirect: true,
        callbackUrl: "/dashboard",
      });
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500">
      <div className="w-full max-w-4xl flex flex-col md:flex-row bg-white shadow-2xl rounded-lg overflow-hidden">
        
        {/* Left Section - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Login to Your Account
          </h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                required
                value={email}
                onChange={({ target }) => setEmail(target.value)}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                required
                value={password}
                onChange={({ target }) => setPassword(target.value)}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded-lg shadow-lg transition"
            >
              Log In
            </button>

            <div className="relative flex items-center justify-center my-4">
              <span className="absolute bg-white px-4">or</span>
              <div className="w-full border-t border-gray-300"></div>
            </div>

            <button
              type="button"
              onClick={() => signIn("google")}
              className="flex items-center justify-center w-full bg-white border border-gray-300 text-gray-800 font-semibold p-3 rounded-lg shadow-sm hover:bg-gray-100 transition"
            >
              <FaGoogle className="mr-3" /> Sign in with Google
            </button>
          </form>
        </div>

        {/* Right Section - Image */}
        <div
          className="hidden md:flex md:w-1/2 items-center justify-center bg-cover bg-center relative"
          style={{
            backgroundImage: `url(https://png.pngtree.com/thumb_back/fw800/background/20231229/pngtree-delicate-pastel-triangles-light-pink-and-blue-gradient-texture-image_13909059.png)`,
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>

          {/* Content in Front */}
          <div className="relative z-20 flex flex-col items-center text-center px-6">
            <img
              src="https://www.charterflightsaviation.com/images/logo.png"
              alt="Company Logo"
              className="h-28 mb-6"
            />
            <h1 className="text-4xl font-bold text-white">
              Welcome Back!
            </h1>
            <p className="text-white mt-2">
              Please log in to access the admin dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
