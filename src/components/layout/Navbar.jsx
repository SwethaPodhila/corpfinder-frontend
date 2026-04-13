import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Building2 } from "lucide-react";

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const location = useLocation();
    const isHome = location.pathname === "/";

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-white/80 backdrop-blur">

            <div className="container mx-auto flex items-center justify-between px-6 py-4">

                {/* Logo */}
                <Link to="/" className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
                        <Building2 className="h-5 w-5 text-white" />
                    </div>

                    <span className="text-xl font-bold">
                        Corp<span className="gradient-text">Finder</span>
                    </span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden items-center gap-8 md:flex">

                    {isHome && (
                        <>
                            <a href="#features" className="text-sm font-medium text-gray-600 hover:text-black">
                                Features
                            </a>

                            <a href="#pricing" className="text-sm font-medium text-gray-600 hover:text-black">
                                Pricing
                            </a>

                            <a href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-black">
                                How It Works
                            </a>
                        </>
                    )}

                    <Link to="/login" className="btn-outline-primary text-sm px-5 py-2">
                        Log In
                    </Link>

                    <Link to="/register" className="btn-primary text-sm px-5 py-2">
                        Sign Up Free
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden"
                    onClick={() => setOpen(!open)}
                >
                    {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {open && (
                <div className="border-t bg-white px-6 py-4 md:hidden">
                    <div className="flex flex-col gap-3">

                        {isHome && (
                            <>
                                <a
                                    href="#features"
                                    className="text-sm text-gray-600"
                                    onClick={() => setOpen(false)}
                                >
                                    Features
                                </a>

                                <a
                                    href="#pricing"
                                    className="text-sm text-gray-600"
                                    onClick={() => setOpen(false)}
                                >
                                    Pricing
                                </a>
                            </>
                        )}

                        <Link
                            to="/login"
                            className="btn-outline-primary text-sm text-center"
                            onClick={() => setOpen(false)}
                        >
                            Log In
                        </Link>

                        <Link
                            to="/register"
                            className="btn-primary text-sm text-center"
                            onClick={() => setOpen(false)}
                        >
                            Sign Up Free
                        </Link>

                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;