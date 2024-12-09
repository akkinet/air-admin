import React from 'react'
import { useSession, signOut } from "next-auth/react";

const Navbar = () => {
  const { data: session } = useSession();
  return (
    <div className="w-full">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white shadow">
        <h2 className="text-lg font-medium text-gray-700">Dashboard</h2>
        {session && (
          <div className="flex items-center space-x-4">
            <p className="text-sm text-gray-600">{session.user.email}</p>
            <img
              className="w-10 h-10 rounded-full"
              src={session.user.image}
              alt="User Avatar"
            />
          </div>
        )}
      </header>
    </div>
  )
}

export default Navbar