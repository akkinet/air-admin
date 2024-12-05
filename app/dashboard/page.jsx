import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Update this path based on your file structure
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  // If the user is not logged in, redirect to the login page
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
          <p className="mt-2 text-sm text-gray-500">
            Welcome, {session.user.name}!
          </p>
        </div>
        <nav className="mt-6">
          <a
            href="#"
            className="block px-6 py-3 text-gray-600 hover:bg-gray-200 hover:text-gray-800"
          >
            Home
          </a>
          <a
            href="#"
            className="block px-6 py-3 text-gray-600 hover:bg-gray-200 hover:text-gray-800"
          >
            Profile
          </a>
          <a
            href="#"
            className="block px-6 py-3 text-gray-600 hover:bg-gray-200 hover:text-gray-800"
          >
            Settings
          </a>
        </nav>
        <form action="/api/auth/signout" method="POST">
          <button
            className="block w-full px-6 py-3 mt-6 text-left text-gray-600 hover:bg-red-100 hover:text-red-600"
            type="submit"
          >
            Logout
          </button>
        </form>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 bg-white shadow">
          <h2 className="text-lg font-medium text-gray-700">Dashboard</h2>
          <div className="flex items-center space-x-4">
            <p className="text-sm text-gray-600">{session.user.email}</p>
            <img
              className="w-10 h-10 rounded-full"
              src={session.user.image}
              alt="User Avatar"
            />
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Card 1 */}
            <div className="p-4 bg-white shadow rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700">
                Total Users
              </h3>
              <p className="mt-2 text-2xl font-bold text-gray-800">1,234</p>
            </div>

            {/* Card 2 */}
            <div className="p-4 bg-white shadow rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700">
                Total Revenue
              </h3>
              <p className="mt-2 text-2xl font-bold text-gray-800">$56,789</p>
            </div>

            {/* Card 3 */}
            <div className="p-4 bg-white shadow rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700">
                Active Subscriptions
              </h3>
              <p className="mt-2 text-2xl font-bold text-gray-800">567</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
