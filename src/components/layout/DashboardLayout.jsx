import React, { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import {
    LayoutDashboard,
    Search,
    Clock,
    Download,
    CreditCard,
    Bell,
    Building2,
    LogOut,
    Menu
} from "lucide-react";

const sidebarLinks = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/dashboard/search", icon: Search, label: "Search" },
    { to: "/dashboard/history", icon: Clock, label: "History" },
    { to: "/dashboard/downloads", icon: Download, label: "Downloads" },
    { to: "/dashboard/subscription", icon: CreditCard, label: "Subscription" },
];

const DashboardLayout = () => {
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : { fullName: "user name" };

    return (
        <div className="flex min-h-screen bg-background">

            {/* Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r bg-card transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                {/* Logo */}
                <div className="flex items-center gap-2 border-b px-6 py-5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                        <Building2 className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-bold">
                        Corp<span className="gradient-text">Finder</span>
                    </span>
                </div>

                {/* Links */}
                <nav className="flex-1 space-y-1 p-4">
                    {sidebarLinks.map((l) => (
                        <Link
                            key={l.to}
                            to={l.to}
                            onClick={() => setSidebarOpen(false)}
                            className={`sidebar-link ${location.pathname === l.to
                                ? "bg-accent text-accent-foreground"
                                : ""
                                }`}
                        >
                            <l.icon className="h-4 w-4" />
                            {l.label}
                        </Link>
                    ))}
                </nav>

                {/* Logout */}
                <div className="border-t p-4">
                    <Link
                        to="/login"
                        className="sidebar-link text-red-500 hover:bg-red-100"
                    >
                        <LogOut className="h-4 w-4" />
                        Logout
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex flex-1 flex-col lg:ml-64">

                {/* Header */}
                <header className="sticky top-0 z-20 flex items-center justify-between border-b bg-white/80 backdrop-blur px-6 py-4">

                    {/* Mobile Menu */}
                    <button
                        className="lg:hidden"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu className="h-5 w-5" />
                    </button>

                    <div className="hidden lg:block" />

                    {/* Right Side */}
                    <div className="flex items-center gap-4">

                        {/* Notification */}
                        <button className="relative">
                            <Bell className="h-5 w-5 text-gray-500" />
                            <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500" />
                        </button>

                        {/* User */}
                        <div className="flex items-center gap-3 rounded-xl bg-gray-100 px-3 py-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                                JD
                            </div>
                            <span className="text-sm font-medium">{user.fullName}</span>
                        </div>

                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6">
                    <Outlet />
                </main>

            </div>
        </div>
    );
};

export default DashboardLayout;
