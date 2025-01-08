import VendorDetails from "../components/VendorDetails";
import { getServerSession } from "next-auth/next";
import authOptions from "@/config/authOptions";
export default async function VendorDetail() {
  const session = await getServerSession(authOptions);
  return <VendorDetails session={session} />
}