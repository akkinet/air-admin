import { getServerSession } from "next-auth/next";
import authOptions from "@/config/authOptions";
import Link from "next/link";

export default async function VendorWelcomePage() {
  const session = await getServerSession(authOptions);
  console.log("Session", session);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100">
      <div className="bg-white shadow-lg rounded-2xl p-10 w-full max-w-3xl text-center my-4">
        <div className="mb-8">
          <img
            src="https://www.charterflightsaviation.com/images/logo.png"
            alt="Aviation Logo"
            className="w-38 h-24 mx-auto mb-4"
          />
          <h1 className="text-5xl font-extrabold text-blue-800 leading-tight mb-4">
            Welcome Aboard, Partner!
          </h1>
          <p className="text-xl text-gray-700">
            We're thrilled to have you join the <span className="font-semibold">Charter Flight Aviation</span> family!
          </p>
        </div>

        <div className="mb-12">
          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            Our platform bridges vendors like you with high-value opportunities in the aviation industry. 
            By collaborating with us, you'll unlock access to elite clients and premium flight bookings. 
            It's time to elevate your business and reach new heights of success. Let's shape the future of luxury travel together!
          </p>

          <h2 className="text-3xl font-semibold text-blue-700 mb-6">
            Why Join Charter Flight Aviation?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-2xl mx-auto">
            <div className="flex items-start space-x-4">
              <div className="text-blue-600 text-3xl">🚀</div>
              <div>
                <h3 className="text-xl font-medium text-gray-800">
                  High-Earning Potential
                </h3>
                <p className="text-gray-600">
                  Enjoy generous commissions with every flight booking you secure.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="text-blue-600 text-3xl">🌍</div>
              <div>
                <h3 className="text-xl font-medium text-gray-800">
                  Global Exposure
                </h3>
                <p className="text-gray-600">
                  Gain visibility with an international network of clients and aviation professionals.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="text-blue-600 text-3xl">🤝</div>
              <div>
                <h3 className="text-xl font-medium text-gray-800">
                  Trusted Partnerships
                </h3>
                <p className="text-gray-600">
                  Work with one of the leading aviation service providers known for reliability and excellence.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="text-blue-600 text-3xl">⏰</div>
              <div>
                <h3 className="text-xl font-medium text-gray-800">
                  24/7 Support
                </h3>
                <p className="text-gray-600">
                  Get dedicated support at any time, ensuring smooth operations and growth.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg mb-8">
          <p className="text-lg text-gray-700 mb-4">
            Joining is simple and rewarding. Complete your registration today and step into a world of lucrative opportunities in aviation. 
            Our team is here to guide you every step of the way.
          </p>
          <p className="text-xl font-medium text-gray-800 mb-6">
            The skies are waiting for you!
          </p>

          <Link
            href="/aircraftVendors"
            className="inline-block px-8 py-4 text-lg text-white bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow hover:opacity-90 transition-transform transform hover:scale-105"
          >
            Start Your Journey – Register Now
          </Link>
        </div>

        <footer className="text-gray-500 text-sm">
          Need assistance?{" "}
          <Link href="/contact" className="text-blue-600 hover:underline">
            Contact our support team.
          </Link>
        </footer>
      </div>
    </div>
  );
}
