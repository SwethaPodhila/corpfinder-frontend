import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import AdminSidebar from "../components/layout/AdminSidebar";

const AdminDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [admins, setAdmins] = useState([]);
    const [users, setUsers] = useState([]);

    // 🔥 FETCH USERS
    const fetchUsers = async () => {
        try {
            const res = await fetch("http://localhost:5000/user");
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
                        <span className="text-sm font-medium">Admin</span>
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

                        <div className="overflow-x-auto rounded-2xl border bg-card">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-muted/50">
                                        <th className="px-4 py-3">#</th>
                                        <th className="px-4 py-3">Name</th>
                                        <th className="px-4 py-3">Email</th>
                                        <th className="px-4 py-3">Phone</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3">Verified</th>
                                        <th className="px-4 py-3">Plan</th>
                                        <th className="px-4 py-3">Expires</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {users.map((user, index) => (
                                        <tr key={user._id} className="border-b hover:bg-muted/30">

                                            <td className="px-4 py-3">{index + 1}</td>

                                            <td className="px-4 py-3 font-medium">
                                                {user.fullName}
                                            </td>

                                            <td className="px-4 py-3">
                                                {user.email}
                                            </td>

                                            <td className="px-4 py-3">
                                                {user.phone}
                                            </td>

                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 rounded text-xs ${user.status === "ACTIVE"
                                                        ? "bg-green-100 text-green-600"
                                                        : "bg-red-100 text-red-600"
                                                    }`}>
                                                    {user.status}
                                                </span>
                                            </td>

                                            <td className="px-4 py-3">
                                                {user.isVerified ? "✅" : "❌"}
                                            </td>

                                            <td className="px-4 py-3">
                                                {user.planId === 1 ? "Trial" : "Paid"}
                                            </td>

                                            <td className="px-4 py-3">
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