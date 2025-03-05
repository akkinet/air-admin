import VendorWelcomePage from "../components/VendorWelcomePage";
import VendorThankYouPage from "../components/ThankyouPage";
import { getServerSession } from "next-auth/next";
import authOptions from "@/config/authOptions";
import { redirect } from "next/navigation";

export default async function WelcomePage() {
  const session = await getServerSession(authOptions);
  const isVendorRegistered = session?.user?.isVendorRegistered;
  const isVendorVerified = session?.user?.isVerified;

  console.log("session", session);

  if (isVendorRegistered && isVendorVerified) {
    redirect("/formDetails");  // Server-side redirect if both conditions are true
  }

  if (isVendorRegistered && !isVendorVerified) {
    return <VendorThankYouPage />;  // Show thank you page if registered but not verified
  }
  return <VendorWelcomePage />;  // Show welcome page if not registered
}
