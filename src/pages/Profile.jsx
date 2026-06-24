import React, { useState, useEffect } from "react";
const PRIMARY = "rgba(10,132,162,1)";
const SECONDARY = "rgba(13,165,199,1)";
const GRADIENT = `linear-gradient(135deg, ${PRIMARY}, ${SECONDARY})`;

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phone: ""
    });

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await fetch("https://corpfinder-backend.onrender.com/user/profile", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await res.json();

            if (res.ok) {
                setUser(data.user);

                setForm({
                    fullName: data.user.fullName || "",
                    email: data.user.email || "",
                    phone: data.user.phone || ""
                });
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="p-6">
                <h2>Loading Profile...</h2>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="p-6">
                <h2>No Profile Found</h2>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 min-h-screen p-6">

          

            {/* Top Profile Card */}
            <div className="bg-white rounded-3xl shadow-sm p-6 mb-6 border border-cyan-100">

                <div className="flex items-center gap-5">

                    <div
                        className="
                        h-24 w-24
                        rounded-full
                        bg-gradient-to-r
                        from-blue-500
                        to-indigo-600
                        text-white
                        flex
                        items-center
                        justify-center
                        text-3xl
                        font-bold
                        shadow-lg
                    "
                        style={{ background: GRADIENT }}
                    >
                        {user.fullName
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")}
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold">
                            {user.fullName}
                        </h2>

                        <p className="text-gray-500">
                            {user.email}
                        </p>

                        <div className="mt-2">
                            {user.isVerified ? (
                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                                    Verified
                                </span>
                            ) : (
                                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                                    Not Verified
                                </span>
                            )}
                        </div>
                    </div>

                </div>
            </div>

            {/* Stats Cards */}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

                {/* Credits */}
                <div className="bg-white rounded-2xl p-5 border shadow-sm border-cyan-100">
                    <p className="text-gray-500">Credits</p>
                    <h3
                        className="text-3xl font-bold"
                        style={{ color: "rgba(10,132,162,1)" }}
                    >
                        {user.credits}
                    </h3>
                </div>

                {/* Plan */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-cyan-100">
                    <p className="text-gray-500">Plan</p>
                    <h3
                        className="text-3xl font-bold uppercase"
                        style={{ color: "rgba(13,165,199,1)" }}
                    >
                        {user.planName}
                    </h3>
                </div>

                {/* Status */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-cyan-100">
                    <p className="text-gray-500">Status</p>
                    <h3
                        className="text-3xl font-bold"
                        style={{ color: "rgba(10,132,162,1)" }}
                    >
                        {user.status}
                    </h3>
                </div>

                {/* Verified */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-cyan-100">
                    <p className="text-gray-500">Verified</p>
                    <h3
                        className="text-3xl font-bold"
                        style={{ color: "rgba(13,165,199,1)" }}
                    >
                        {user.isVerified ? "YES" : "NO"}
                    </h3>
                </div>

            </div>

            {/* Information Sections */}

            <div className="grid md:grid-cols-2 gap-6">

                {/* Personal Info */}

                <div className="bg-white rounded-3xl shadow-md p-6">
                    <h3 className="text-xl font-bold mb-5">
                        Personal Information
                    </h3>

                    <div className="space-y-4">

                        <div>
                            <p className="text-gray-500 text-sm">
                                Full Name
                            </p>
                            <p className="font-semibold">
                                {user.fullName}
                            </p>
                        </div>

                        <div>
                            <p className="text-gray-500 text-sm">
                                Email
                            </p>
                            <p className="font-semibold">
                                {user.email}
                            </p>
                        </div>

                        <div>
                            <p className="text-gray-500 text-sm">
                                Phone
                            </p>
                            <p className="font-semibold">
                                {user.phone || "Not Added"}
                            </p>
                        </div>

                    </div>
                </div>

                {/* Subscription */}

                <div className="bg-white rounded-3xl shadow-md p-6">
                    <h3 className="text-xl font-bold mb-5">
                        Subscription Details
                    </h3>

                    <div className="space-y-4">

                        <div>
                            <p className="text-gray-500 text-sm">
                                Plan Name
                            </p>
                            <p className="font-semibold uppercase">
                                {user.planName}
                            </p>
                        </div>

                        <div>
                            <p className="text-gray-500 text-sm">
                                Credits
                            </p>
                            <p className="font-semibold">
                                {user.credits}
                            </p>
                        </div>

                        <div>
                            <p className="text-gray-500 text-sm">
                                Plan Start Date
                            </p>
                            <p className="font-semibold">
                                {user.planStartDate
                                    ? new Date(
                                        user.planStartDate
                                    ).toLocaleDateString()
                                    : "-"}
                            </p>
                        </div>

                        <div>
                            <p className="text-gray-500 text-sm">
                                Plan End Date
                            </p>
                            <p className="font-semibold">
                                {user.planEndDate
                                    ? new Date(
                                        user.planEndDate
                                    ).toLocaleDateString()
                                    : "-"}
                            </p>
                        </div>

                        <div>
                            <p className="text-gray-500 text-sm">
                                Trial Ends
                            </p>
                            <p className="font-semibold">
                                {user.trialEndsAt
                                    ? new Date(
                                        user.trialEndsAt
                                    ).toLocaleDateString()
                                    : "-"}
                            </p>
                        </div>

                    </div>
                </div>

            </div>

        </div>
    );
};

export default Profile;