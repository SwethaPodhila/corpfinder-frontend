import React, { useState, useEffect } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { useCredits } from "../../context/CreditsContext";
import { ChevronDown } from "lucide-react";
import {
    LayoutDashboard,
    Search,
    Clock,
    Download,
    CreditCard,
    Building2,
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
    const { credits } = useCredits();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const user = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))
        : { fullName: "user name" };

    // close dropdown on outside click
    useEffect(() => {
        const handleClick = () => setUserMenuOpen(false);
        if (userMenuOpen) window.addEventListener("click", handleClick);

        return () => window.removeEventListener("click", handleClick);
    }, [userMenuOpen]);

    const handleLogout = () => {
        localStorage.removeItem("user");
        window.location.href = "/login";
    };

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

                        {/* Credits */}
                        <div className="flex items-center gap-3 px-4 py-2 rounded-xl border bg-white shadow-sm">
                            <CreditCard className="h-5 w-5 text-cyan-600" />
                            <span className="text-sm font-semibold text-gray-800">
                                {credits} Credits
                            </span>
                        </div>

                        {/* User Dropdown */}
                        <div className="relative">

                            {/* User Button */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setUserMenuOpen(!userMenuOpen);
                                }}
                                className="flex items-center gap-2 rounded-xl bg-gray-100 px-3 py-2"
                            >
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                                    {user.fullName.split(" ").map((n) => n[0])}
                                </div>

                                <span className="text-sm font-medium">
                                    {user.fullName}
                                </span>

                                {/* Dropdown icon */}
                                <ChevronDown
                                    className={`h-4 w-4 transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""
                                        }`}
                                />
                            </button>

                            {/* Dropdown */}
                            {userMenuOpen && (
                                <div className="absolute right-0 mt-2 w-40 rounded-xl border bg-white shadow-lg z-50">

                                    <Link
                                        to="/dashboard/profile"
                                        className="block px-4 py-2 text-sm hover:bg-gray-100"
                                        onClick={() => setUserMenuOpen(false)}
                                    >
                                        Profile
                                    </Link>

                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-100"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
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