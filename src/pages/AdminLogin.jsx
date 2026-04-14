import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Building2 } from "lucide-react";
import authImg from "../assets/auth-illustration.jpg";

const AdminLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate("/admin/dashboard");
    };

    return (
        <div className="flex min-h-screen">
            {/* Left Image */}
            <div className="hidden w-1/2 lg:block relative">
                <img
                    src={authImg}
                    alt="Admin"
                    className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/80 to-indigo-600/40 flex items-end p-12">
                    <div>
                        <h2 className="font-heading text-3xl font-bold text-primary-foreground">
                            Admin Portal
                        </h2>
                        <p className="mt-2 text-indigo-100">
                            Manage companies and employee data.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Form */}
            <div className="flex flex-1 items-center justify-center p-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md"
                >
                    <Link to="/" className="mb-8 flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
                            <Building2 className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <span className="text-xl font-bold font-heading">
                            Corp<span className="gradient-text">Finder</span>
                        </span>
                    </Link>

                    <div className="mb-6 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
                            <Shield className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h1 className="font-heading text-2xl font-bold text-foreground">
                                Admin Login
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Restricted access
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-foreground">
                                Admin Username
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-styled"
                                placeholder="admin@corpfinder.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-foreground">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-styled"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button type="submit" className="btn-primary w-full py-3.5">
                            Access Admin Panel
                        </button>
                    </form>

                    <p className="mt-6 text-center text-xs text-muted-foreground">
                        <Link to="/login" className="hover:text-primary">
                            ← Back to User Login
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default AdminLogin;