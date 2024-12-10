import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Update this path based on your file structure
import { redirect } from "next/navigation";
import Dashboard from "../components/Dashboard";

export default async function DashboardPage() {
  // const session = await getServerSession(authOptions);

  // // If the user is not logged in, redirect to the login page
  // if (!session) {
  //   redirect("/login");
  // }

  return <Dashboard/>
}
