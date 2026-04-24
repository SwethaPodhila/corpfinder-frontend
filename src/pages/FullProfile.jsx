import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {  useLocation } from "react-router-dom";

const EmployeeProfile = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await fetch(
                    `https://corpfinder-backend.onrender.com/employees/user/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const result = await res.json();
                setData(result.data || result);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                Loading profile...
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-500 font-medium">
                No employee found
            </div>
        );
    }

    // Back handler
    const handleBack = () => {
        navigate("/dashboard/search", {
            state: location.state, // preserves previous search/filter state
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">

            {/* TOP BAR */}
            <div className="max-w-6xl mx-auto flex items-center justify-between mb-6">

                {/* BACK BUTTON (Professional) */}
                <button
                    onClick={handleBack}
                    className="flex items-center gap-2 px-4 py-2 bg-white border shadow-sm rounded-lg hover:bg-gray-100 transition text-sm font-medium"
                >
                    ← Back to Search
                </button>

                <span className="text-sm text-gray-500">
                    Employee ID: <b>{id}</b>
                </span>
            </div>

            {/* HERO CARD */}
            <div className="max-w-6xl mx-auto bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 text-white rounded-2xl shadow-lg p-8">

                <div className="flex items-center gap-5">

                    {/* Avatar */}
                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold">
                        {data.first_name?.charAt(0)}
                    </div>

                    {/* Name */}
                    <div>
                        <h1 className="text-3xl font-bold">
                            {data.first_name} {data.last_name}
                        </h1>
                        <p className="opacity-90 mt-1">
                            {data.designation || "No designation"}
                        </p>

                        <div className="flex gap-2 mt-3 flex-wrap">
                            <span className="bg-white/20 px-3 py-1 rounded-full text-xs">
                                {data.company_name || "Company"}
                            </span>
                            <span className="bg-white/20 px-3 py-1 rounded-full text-xs">
                                {data.city || "City"}
                            </span>
                            <span className="bg-white/20 px-3 py-1 rounded-full text-xs">
                                {data.country || "Country"}
                            </span>
                        </div>
                    </div>

                </div>
            </div>

            {/* GRID CONTENT */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">

                {/* PERSONAL */}
                <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition">
                    <h2 className="text-lg font-semibold mb-4">Personal Info</h2>

                    <div className="space-y-2 text-sm text-gray-700">
                        <p><b>Email:</b> {data.personal_email || "-"}</p>
                        <p><b>Phone:</b> {data.phone || "-"}</p>
                        <p><b>City:</b> {data.city || "-"}</p>
                        <p><b>State:</b> {data.state || "-"}</p>
                        <p><b>Country:</b> {data.country || "-"}</p>
                    </div>
                </div>

                {/* COMPANY */}
                <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition">
                    <h2 className="text-lg font-semibold mb-4">Company Info</h2>

                    <div className="space-y-2 text-sm text-gray-700">
                        <p><b>Name:</b> {data.company_name || "-"}</p>
                        <p><b>Type:</b> {data.company_type || "-"}</p>
                        <p><b>Industry:</b> {data.company_industry || "-"}</p>
                        <p><b>Email:</b> {data.company_email || "-"}</p>
                        <p><b>Phone:</b> {data.company_phone || "-"}</p>
                        <p><b>Website:</b> {data.company_website || "-"}</p>
                    </div>
                </div>

                {/* SOCIAL */}
                <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition">
                    <h2 className="text-lg font-semibold mb-4">Social</h2>

                    <div className="space-y-2 text-sm text-gray-700">
                        <p><b>LinkedIn ID:</b> {data.linkedin_id || "-"}</p>

                        <p>
                            <b>LinkedIn:</b>{" "}
                            {data.linkedin_url ? (
                                <a
                                    href={data.linkedin_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-blue-600 underline"
                                >
                                    View Profile
                                </a>
                            ) : (
                                "-"
                            )}
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default EmployeeProfile;
