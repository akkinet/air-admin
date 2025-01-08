"use client"
import Link from "next/link";

export default function VendorThankYouPage() {


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-green-50 to-green-100">
      <div className="bg-white shadow-lg rounded-2xl p-10 w-full max-w-3xl text-center my-4">
        <div className="mb-8">
          <img
            src="https://www.charterflightsaviation.com/images/logo.png"
            alt="Aviation Logo"
            className="w-38 h-24 mx-auto mb-4"
          />
          <h1 className="text-5xl font-extrabold text-green-800 leading-tight mb-4">
            Thank You for Submitting!
          </h1>
          <p className="text-xl text-gray-700">
            We appreciate your interest in partnering with{" "}
            <span className="font-semibold">Charter Flight Aviation</span>.
          </p>
        </div>

        <div className="mb-12">
          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            Your vendor information has been successfully received. Our team is
            currently reviewing your submission, and we will reach out to you
            shortly after verification.
          </p>
          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            Please stay connected with us during this process. If we need any
            additional information, we will contact you directly.
          </p>

          <h2 className="text-3xl font-semibold text-green-700 mb-6">
            What’s Next?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-2xl mx-auto">
            <div className="flex items-start space-x-4">
              <div className="text-green-600 text-3xl">📞</div>
              <div>
                <h3 className="text-xl font-medium text-gray-800">
                  Stay Connected
                </h3>
                <p className="text-gray-600">
                  Keep an eye on your email or phone for updates from our team.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="text-green-600 text-3xl">🛩️</div>
              <div>
                <h3 className="text-xl font-medium text-gray-800">
                  Exciting Opportunities Await
                </h3>
                <p className="text-gray-600">
                  Once verified, you’ll gain access to premium aviation
                  opportunities.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-lg mb-8">
          <p className="text-lg text-gray-700 mb-4">
            If you have any questions or need further assistance, feel free to
            reach out to us.
          </p>
          <p className="text-xl font-medium text-gray-800 mb-6">
            We look forward to collaborating with you!
          </p>

          {/* New View Form Details Button */}
          <Link
            href="/formDetails"
            className="inline-block px-8 py-4 text-lg text-white bg-gradient-to-r from-green-500 to-green-700 rounded-lg shadow hover:opacity-90 transition-transform transform hover:scale-105"
          >
            View Form Details
          </Link>
        </div>

        <footer className="text-gray-500 text-sm">
          Need to revisit our platform?{" "}
          <Link href="/" className="text-green-600 hover:underline">
            Return to Home
          </Link>
        </footer>
      </div>
    </div>
  );
}
