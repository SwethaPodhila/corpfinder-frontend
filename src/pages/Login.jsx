import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Building2, Eye, EyeOff } from "lucide-react";
import authImg from "../assets/auth-illustration.jpg";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPw, setShowPw] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate("/dashboard");
    };

    return (
        <div className="flex min-h-screen">
            {/* Left Image */}
            <div className="hidden w-1/2 lg:block relative">
                <img
                    src={authImg}
                    alt="Login"
                    className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/80 to-indigo-600/40 flex items-end p-12">
                    <div>
                        <h2 className="font-heading text-3xl font-bold text-primary-foreground">
                            Welcome back
                        </h2>
                        <p className="mt-2 text-indigo-100">
                            Access your company directory dashboard.
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

                    <h1 className="font-heading text-2xl font-bold text-foreground">
                        Sign in to your account
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        Enter your credentials to continue
                    </p>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-foreground">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-styled"
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-foreground">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPw ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input-styled pr-10"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPw(!showPw)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                >
                                    {showPw ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="btn-primary w-full py-3.5">
                            Sign In
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-muted-foreground">
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className="font-semibold text-primary hover:underline"
                        >
                            Sign up
                        </Link>
                    </p>

                    <p className="mt-2 text-center text-xs text-muted-foreground">
                        <Link to="/admin/login" className="hover:text-primary">
                            Admin Login →
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;