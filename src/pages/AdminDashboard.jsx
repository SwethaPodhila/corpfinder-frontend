import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import AdminSidebar from "../components/layout/AdminSidebar";
import { jwtDecode } from "jwt-decode";

const AdminDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [adminName, setAdminName] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("adminToken");

        if (token) {
            try {
                const decoded = jwtDecode(token);
                console.log(decoded);

                setAdminName(decoded.username || decoded.email || "Admin");
            } catch (err) {
                console.log("Token decode error", err);
            }
        }
    }, []);

    // 🔥 FETCH USERS
    const fetchUsers = async () => {
        try {
            const res = await fetch("https://corpfinder-backend.onrender.com/user/users");
            const data = await res.json();
            setUsers(data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="flex min-h-screen bg-background">

            <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            <div className="flex flex-1 flex-col lg:ml-64">

                {/* HEADER SAME */}
                <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-card/80 backdrop-blur-xl px-6 py-4">
                    <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
                        <Menu className="h-5 w-5" />
                    </button>

                    <h1 className="font-heading text-lg font-semibold">
                        Admin Dashboard
                    </h1>

                    <div className="flex items-center gap-2 rounded-xl bg-muted px-3 py-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                            A
                        </div>
                        <span className="text-sm font-medium">{adminName}</span>
                    </div>
                </header>

                {/* MAIN */}
                <main className="flex-1 p-6">

                    {/* 🔥 STATS */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="p-5 rounded-xl border bg-card">
                            <h3>Total Users</h3>
                            <p className="text-2xl font-bold">{users.length}</p>
                        </div>

                        <div className="p-5 rounded-xl border bg-card">
                            <h3>Active Users</h3>
                            <p className="text-2xl font-bold">
                                {users.filter(u => u.status === "ACTIVE").length}
                            </p>
                        </div>

                        <div className="p-5 rounded-xl border bg-card">
                            <h3>Verified Users</h3>
                            <p className="text-2xl font-bold">
                                {users.filter(u => u.isVerified).length}
                            </p>
                        </div>

                        <div className="p-5 rounded-xl border bg-card">
                            <h3>Trial Users</h3>
                            <p className="text-2xl font-bold">
                                {users.filter(u => u.planId === 1).length}
                            </p>
                        </div>
                    </div>

                    {/* 👨‍💻 USERS TABLE */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <h2 className="font-heading text-xl font-bold mb-4">
                            Registered Users
                        </h2>
                        <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
                            <table className="w-full text-sm text-foreground">

                                {/* HEADER */}
                                <thead className="bg-muted text-left text-xs uppercase tracking-wider text-gray-600">
                                    <tr>
                                        <th className="px-5 py-4">#</th>
                                        <th className="px-5 py-4">Name</th>
                                        <th className="px-5 py-4">Email</th>
                                        <th className="px-5 py-4">Phone</th>
                                        <th className="px-5 py-4">Status</th>
                                        <th className="px-5 py-4">Verified</th>
                                        <th className="px-5 py-4">Plan</th>
                                        <th className="px-5 py-4">Expires</th>
                                    </tr>
                                </thead>

                                {/* BODY */}
                                <tbody className="divide-y divide-border">
                                    {users.map((user, index) => (
                                        <tr
                                            key={user._id}
                                            className="hover:bg-muted/40 transition-colors"
                                        >

                                            <td className="px-5 py-4 font-medium text-gray-700">
                                                {index + 1}
                                            </td>

                                            <td className="px-5 py-4 font-semibold text-gray-900">
                                                {user.fullName}
                                            </td>

                                            <td className="px-5 py-4 text-gray-600">
                                                {user.email}
                                            </td>

                                            <td className="px-5 py-4 text-gray-600">
                                                {user.phone}
                                            </td>

                                            <td className="px-5 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium
                            ${user.status === "ACTIVE"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                    }`}>
                                                    {user.status}
                                                </span>
                                            </td>

                                            <td className="px-5 py-4 text-lg">
                                                {user.isVerified ? "✅" : "❌"}
                                            </td>

                                            <td className="px-5 py-4 text-gray-700">
                                                {user.planId === 1 ? "Trial" : "Paid"}
                                            </td>

                                            <td className="px-5 py-4 text-gray-600">
                                                {new Date(user.trialEndsAt).toLocaleDateString()}
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>

                            </table>
                        </div>
                    </motion.div>

                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;