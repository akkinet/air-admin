"use client";

import React, { useState, useEffect } from 'react';
import { getSession } from "next-auth/react";
import Link from 'next/link';
import {
    FaPhone,
    FaEnvelope,
    FaMapMarkerAlt,
    FaBuilding,
    FaGlobe,
    FaClock,
    FaFacebook,
    FaInstagram,
    FaLinkedin,
    FaTwitter,
    FaSnapchat,
    FaWhatsapp,
} from "react-icons/fa";

export default function VendorDetails({ session }) {
    const [vendor, setVendor] = useState(null);
    const [loading, setLoading] = useState(true);
    const isVendorRegistered = session?.user?.isVendorRegistered;
    const isVendorVerified = session?.user?.isVerified;

    useEffect(() => {
        const fetchVendorData = async () => {
            const session = await getSession();

            if (session && session.user?.email) {
                const response = await fetch(
                    `/api/vendor?email=${session.user.email}`
                );
                const data = await response.json();
                setVendor(data);
            }
            setLoading(false);
        };

        fetchVendorData();
    }, []);

    if (loading) {
        return <p className="text-center mt-20 text-gray-600">Loading vendor details...</p>;
    }

    if (!vendor) {
        return <p className="text-center mt-20 text-red-500">Vendor data not found.</p>;
    }

    const socialIconMap = {
        facebook: <FaFacebook className="text-2xl text-blue-600" />,
        instagram: <FaInstagram className="text-2xl text-pink-500" />,
        linkedin: <FaLinkedin className="text-2xl text-blue-700" />,
        twitter: <FaTwitter className="text-2xl text-sky-400" />,
        snapchat: <FaSnapchat className="text-2xl text-yellow-400" />,
        whatsapp: <FaWhatsapp className="text-2xl text-green-500" />,
    };

    const {
        corporateName,
        firstName,
        lastName,
        phone,
        additionalPhone,
        email,
        addressLine1,
        addressLine2,
        city,
        state,
        zipCode,
        businessDescription,
        operationCoverage,
        createdAt,
        socialLinks,
        branches,
    } = vendor;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-green-50 to-green-100">

            <div className="bg-white shadow-lg rounded-2xl p-10 pt-4 w-full max-w-4xl text-center my-10">
                {/* Back to Dashboard Button */}
                {isVendorRegistered && !isVendorVerified && (
                    <Link
                        href="/dashboard"
                        className="inline-block p-2 text-lg text-white bg-gradient-to-r from-green-500 to-green-700 rounded-lg shadow hover:opacity-90 transition-transform transform hover:scale-105"
                    >
                        ← Back to Dashboard
                    </Link>
                )}
                <p className='border-t-2 border-green-500 mt-4'></p>

                {/* Header Section */}
                <div className="mb-8 flex justify-between items-center ">
                    <div className="flex items-center space-x-4">
                        <FaBuilding className="text-7xl text-green-600" />
                        <div className="text-left">
                            <h1 className="text-5xl font-extrabold text-green-800 leading-tight">
                                {corporateName}
                            </h1>
                            <p className="text-xl text-gray-600 mt-2">
                                {firstName} {lastName}
                            </p>
                        </div>
                    </div>


                </div>

                {/* Business Description */}
                <div className="flex flex-col items-start mb-10">
                    <h3 className="text-3xl font-semibold text-green-700 flex items-center">
                        <FaGlobe className="text-green-500 mr-3" /> Business Description
                    </h3>
                    <p className="text-lg text-gray-700 mt-4">{businessDescription}</p>
                </div>

                {/* Operation Coverage */}
                <div className="flex flex-col items-start mb-10">
                    <h3 className="text-3xl font-semibold text-green-700 flex items-center">
                        <FaMapMarkerAlt className="text-green-500 mr-3" /> Operation Coverage
                    </h3>
                    <p className="text-lg text-gray-700 mt-4">{operationCoverage}</p>
                </div>

                {/* Contact Information */}
                <div className="flex flex-col items-start mb-10">
                    <h3 className="text-3xl font-semibold text-green-700 flex items-center">
                        <FaPhone className="text-green-500 mr-3" /> Contact Information
                    </h3>
                    <p className="text-lg mt-4"><strong>Phone:</strong> {phone}</p>
                    <p className="text-lg"><strong>Additional:</strong> {additionalPhone}</p>
                    <p className="text-lg"><strong>Email:</strong> {email}</p>
                </div>

                {/* Office Location */}
                <div className="flex flex-col items-start mb-10">
                    <h3 className="text-3xl font-semibold text-green-700 flex items-center">
                        <FaMapMarkerAlt className="text-green-500 mr-3" /> Office Location
                    </h3>
                    <p>{addressLine1}</p>
                    <p>{addressLine2}</p>
                    <p>{city}, {state} - {zipCode}</p>
                </div>
                {/* Social Links */}
                <div className="flex flex-col items-start mb-10">
                    <h3 className="text-3xl font-semibold text-green-700 flex items-center">
                        🌐 Social Links
                    </h3>
                    <div className="flex flex-wrap gap-4 mt-4">
                        {socialLinks.map((link) => (
                            <a
                                key={link.type}
                                href={link.value}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2"
                            >
                                {socialIconMap[link.type]}
                                <span>{link.value}</span>
                            </a>
                        ))}
                    </div>
                </div>



                {/* Created At */}
                <div className="flex flex-col items-start mb-10">
                    <h3 className="text-3xl font-semibold text-green-700 flex items-center">
                        <FaClock className="text-green-500 mr-3" /> Created At
                    </h3>
                    <p>{new Date(createdAt).toLocaleDateString()}</p>
                </div>

                {/* Branch Details */}
                <div className="mt-12">
                    <h3 className="text-4xl font-bold text-green-800 mb-6">Branch Details</h3>
                    {branches.map((branch) => (
                        <div
                            key={branch.branchId}
                            className="bg-gradient-to-b from-green-50 to-green-100 p-8 rounded-2xl shadow-lg mt-8 text-left"
                        >
                            <h2 className="text-3xl font-semibold text-green-700">{branch.departmentName}</h2>
                            <p className="text-gray-500 mt-2">{branch.city}, {branch.state}</p>

                            {/* Address */}
                            <p className="mt-6 text-lg text-gray-700">
                                <strong className="text-green-700">Address Line 1:</strong> {branch.addressLine1}
                            </p>
                            <p className="text-lg text-gray-700">
                                <strong className="text-green-700">Address Line 2:</strong> {branch.addressLine2}
                            </p>
                            <p className="text-lg text-gray-700">
                                <strong className="text-green-700">Zip Code:</strong> {branch.zipCode}
                            </p>

                            {/* Contact Details */}
                            <p className="mt-6 text-lg text-gray-700">
                                <strong className="text-green-700">Phone:</strong> {branch.contactNo}
                            </p>
                            <p className="text-lg text-gray-700">
                                <strong className="text-green-700">Email:</strong> {branch.email}
                            </p>

                            {/* Social Links */}
                            <div className="flex flex-wrap items-center space-x-6 mt-6">
                                {branch.socialLinks.map((link) => (
                                    <a
                                        key={link.type}
                                        href={link.value}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center space-x-2 text-green-600 hover:underline"
                                    >
                                        {socialIconMap[link.type]}
                                        <span>{link.type.charAt(0).toUpperCase() + link.type.slice(1)}</span>
                                    </a>
                                ))}
                            </div>

                            {/* Branch Image */}
                            {branch.file && (
                                <div className="mt-10">
                                    <a
                                        href={branch.file}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block px-6 py-3 text-lg text-white bg-green-500 rounded-lg shadow hover:opacity-90 transition-transform transform hover:scale-105"
                                    >
                                        View Branch File
                                    </a>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}
