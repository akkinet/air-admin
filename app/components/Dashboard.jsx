"use client";

// import { useSession } from "next-auth/react";

export default function Dashboard({session}) {
  // const { data: session } = useSession();
  // console.log("session", session)

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
      </div>
    </div>
  );
}
