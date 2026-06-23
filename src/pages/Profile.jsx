import React, { useState, useEffect } from "react";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phone: ""
    });

    // ================= FETCH PROFILE FROM API =================
    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await fetch("http://localhost:5000/user/profile", {
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
            } else {
                alert(data.msg || "Failed to load profile");
            }

        } catch (err) {
            console.log(err);
            alert("Server error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    // ================= INPUT CHANGE =================
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // ================= UPDATE PROFILE =================
    const handleSave = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await fetch("http://localhost:5000/user/update-profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(form)
            });

            const data = await res.json();

            if (res.ok) {
                setUser(data.user);

                // sync localStorage also
                localStorage.setItem("user", JSON.stringify(data.user));

                setOpenModal(false);
                alert("Profile updated successfully");
            } else {
                alert(data.msg || "Update failed");
            }

        } catch (err) {
            console.log(err);
            alert("Server error");
        }
    };

    if (loading) {
        return <p className="p-6">Loading profile...</p>;
    }

    if (!user) {
        return <p className="p-6">No user found</p>;
    }

    return (
        <div className="max-w-3xl mx-auto p-6">

            {/* HEADER */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">My Profile</h1>

                <button
                    onClick={() => setOpenModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Edit Profile
                </button>
            </div>

            {/* PROFILE CARD */}
            <div className="bg-white shadow-lg rounded-2xl p-6 space-y-6">

                {/* AVATAR */}
                <div className="flex items-center gap-4">

                    <div className="h-14 w-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-bold">
                        {user.fullName
                            .split(" ")
                            .map(n => n[0])
                            .join("")
                        }
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold">{user.fullName}</h2>
                        <p className="text-gray-500 text-sm">{user.email}</p>
                    </div>

                </div>

                <hr />

                {/* DETAILS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div>
                        <p className="text-gray-500 text-sm">Full Name</p>
                        <p className="font-medium">{user.fullName}</p>
                    </div>

                    <div>
                        <p className="text-gray-500 text-sm">Email</p>
                        <p className="font-medium">{user.email}</p>
                    </div>

                    <div>
                        <p className="text-gray-500 text-sm">Phone</p>
                        <p className="font-medium">{user.phone || "Not added"}</p>
                    </div>

                    <div>
                        <p className="text-gray-500 text-sm">Plan</p>
                        <p className="font-medium">{user.planName}</p>
                    </div>

                    <div>
                        <p className="text-gray-500 text-sm">Credits</p>
                        <p className="font-medium">{user.credits}</p>
                    </div>

                    <div>
                        <p className="text-gray-500 text-sm">Status</p>
                        <p className="font-medium text-green-600">{user.status}</p>
                    </div>

                </div>
            </div>

            {/* ================= MODAL ================= */}
            {openModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

                    <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl">

                        <h2 className="text-xl font-bold mb-4">Edit Profile</h2>

                        <div className="space-y-3">

                            <input
                                name="fullName"
                                value={form.fullName}
                                onChange={handleChange}
                                className="w-full border px-3 py-2 rounded-lg"
                                placeholder="Full Name"
                            />

                            <input
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                className="w-full border px-3 py-2 rounded-lg"
                                placeholder="Email"
                            />

                            <input
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                className="w-full border px-3 py-2 rounded-lg"
                                placeholder="Phone"
                            />

                        </div>

                        {/* BUTTONS */}
                        <div className="flex justify-end gap-2 mt-5">

                            <button
                                onClick={() => setOpenModal(false)}
                                className="px-4 py-2 bg-gray-300 rounded-lg"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleSave}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg"
                            >
                                Save
                            </button>

                        </div>

                    </div>
                </div>
            )}

        </div>
    );
};

export default Profile;