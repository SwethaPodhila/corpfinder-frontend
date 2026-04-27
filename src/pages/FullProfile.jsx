import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Mail, Phone, MapPin, Building2, Globe } from "lucide-react";

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
            <div className="min-h-screen flex items-center justify-center text-red-500">
                No employee found
            </div>
        );
    }

    const handleBack = () => {
        navigate("/dashboard/search", {
            state: location.state,
        });
    };

    return (
        <div className="min-h-screen bg-gray-100">

            {/* HEADER */}
            <div className="bg-white border-b px-6 py-4 flex justify-between items-center">
                <button
                    onClick={handleBack}
                    className="px-4 py-2 rounded-lg text-white text-sm font-medium transition"
                    style={{
                        background: "linear-gradient(135deg, rgba(10,132,162,1), rgba(13,165,199,1))",
                        boxShadow: "0 4px 14px -2px rgba(10,132,162,0.4)"
                    }}
                >
                    ← Back
                </button>

                <span className="text-xs text-gray-400">
                    ID: {id}
                </span>
            </div>

            {/* PROFILE TOP */}
            <div className="max-w-5xl mx-auto bg-white mt-6 rounded-xl shadow p-6 border-t-4 border-cyan-500">

                <div className="flex gap-6 items-center">

                    {/* Avatar */}
                    <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold">
                        {data.first_name?.charAt(0)}
                    </div>

                    {/* Basic Info */}
                    <div>
                        <h1 className="text-2xl font-bold text-cyan-600">
                            {data.first_name} {data.last_name}
                        </h1>

                        <p className="text-gray-600 text-sm mt-1">
                            {data.designation || "No designation"}
                        </p>

                        <p className="text-sm text-gray-500 mt-2">
                            {data.company_name || "-"} • {data.city || "-"}, {data.country || "-"}
                        </p>
                    </div>
                </div>
            </div>

            {/* DETAILS SECTION */}
            <div className="max-w-5xl mx-auto mt-6 space-y-6">

                {/* PERSONAL */}
                <div className="bg-white rounded-xl shadow p-6 border-l-4 border-cyan-500 transition hover:shadow-lg hover:-translate-y-1">
                    <h2 className="text-md font-semibold mb-4 pb-2 border-b border-cyan-200 text-cyan-700">
                        Personal Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">

                        <div className="flex items-center gap-2">
                            <Mail size={16} />
                            {data.personal_email || "-"}
                        </div>

                        <div className="flex items-center gap-2">
                            <Phone size={16} />
                            {data.phone || "-"}
                        </div>

                        <div className="flex items-center gap-2">
                            <MapPin size={16} />
                            {data.city || "-"}, {data.state || "-"}, {data.country || "-"}
                        </div>

                    </div>
                </div>

                {/* COMPANY */}
                <div className="bg-white rounded-xl shadow p-6 border-l-4 border-cyan-500 transition hover:shadow-lg hover:-translate-y-1">
                    <h2 className="text-md font-semibold mb-4 pb-2 border-b border-cyan-200 text-cyan-700">
                        Company Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">

                        <div className="flex items-center gap-2">
                            <Building2 size={16} />
                            {data.company_name || "-"}
                        </div>

                        <div>
                            <span className="text-gray-500">Type: </span>
                            {data.company_type || "-"}
                        </div>

                        <div>
                            <span className="text-gray-500">Industry: </span>
                            {data.company_industry || "-"}
                        </div>

                        <div className="flex items-center gap-2">
                            <Mail size={16} />
                            {data.company_email || "-"}
                        </div>

                        <div className="flex items-center gap-2">
                            <Phone size={16} />
                            {data.company_phone || "-"}
                        </div>

                        <div className="flex items-center gap-2">
                            <Globe size={16} />
                            {data.company_website || "-"}
                        </div>

                    </div>
                </div>

                {/* SOCIAL */}
                <div className="bg-white rounded-xl shadow p-6 border-l-4 border-cyan-500 transition hover:shadow-lg hover:-translate-y-1">
                    <h2 className="text-md font-semibold mb-4 pb-2 border-b border-cyan-200 text-cyan-700">
                        Social
                    </h2>

                    <div className="space-y-3 text-sm">

                        <div>
                            <span className="text-gray-500">LinkedIn ID: </span>
                            {data.linkedin_id || "-"}
                        </div>

                        <div>
                            <span className="text-gray-500">Profile: </span>
                            {data.linkedin_url ? (
                                <a
                                    href={data.linkedin_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-cyan-600 hover:text-cyan-800 hover:underline"
                                >
                                    Open Profile
                                </a>
                            ) : "-"}
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default EmployeeProfile;