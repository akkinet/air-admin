// import Dashboard from "../components/Dashboard";
import { getServerSession } from "next-auth/next";
import authOptions from "@/config/authOptions";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  return (
    <div className="h-full flex flex-col items-center justify-center bg-gray-100 ">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-2xl text-center">
        <h1 className="text-4xl font-bold text-gray-900">
          Welcome to Your Dashboard
        </h1>
        <p className="mt-4 text-gray-600 text-lg">
          Hello, {session.user.name}!
        </p>
      </div>
    </div>
  );
}
