"use client";

import { useSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session } = useSession();

  return (
    <div className="h-full flex flex-col items-center justify-center bg-gray-100 ">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-2xl text-center">
        <h1 className="text-4xl font-bold text-gray-900">
          Welcome to Your Dashboard
        </h1>
        <p className="mt-4 text-gray-600 text-lg">
          {session
            ? `Hello, ${session.user.name}!`
            : "Sign in to personalize your experience."}
        </p>

        <div className="mt-8">
          {session ? (
            <button
              onClick={() => {
                alert("Access your tools and data!");
              }}
              className="bg-customPink text-white px-6 py-2 rounded shadow hover:bg-customBlue transition duration-300"
            >
              Go to Tools
            </button>
          ) : (
            <button
              onClick={() => {
                alert("Redirecting to login...");
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-800 transition duration-300"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
