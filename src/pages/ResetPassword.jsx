import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import authImg from "../assets/auth-illustration.jpg";

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            setLoading(true);

            const res = await fetch(
                `https://corpfinder-backend.onrender.com/user/reset-password/${token}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ password })
                }
            );

            const data = await res.json();
            console.log("RESET PASSWORD RESPONSE:", data);

            if (!res.ok) {
                alert(data.msg);
                return;
            }

            alert("Password reset successful 🔥");
            navigate("/login");

        } catch (err) {
            console.log(err);
            alert("Server error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />

            <div className="flex min-h-screen bg-gray-50">
                <div className="hidden w-1/2 lg:block relative">
                    <img
                        src={authImg}
                        alt="Login"
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/80 to-indigo-600/40 flex items-end p-12">
                        <div>
                            <h2 className="font-heading text-3xl font-bold text-primary-foreground">
                                Reset Your Password
                            </h2>
                            <p className="mt-2 text-indigo-100">
                                Secure your CorpFinder account in few steps
                            </p>
                        </div>
                    </div>
                </div>

                {/* RIGHT FORM */}
                <div className="flex flex-1 items-center justify-center p-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full max-w-md"
                    >
                        {/* HEADER */}
                        <div className="text-center mb-6">
                            <div className="flex justify-center mb-3">
                                <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center">
                                    <Lock className="text-white" />
                                </div>
                            </div>

                            <h1 className="text-2xl font-bold">
                                Reset Password
                            </h1>
                            <p className="text-sm text-gray-500">
                                Enter new password below
                            </p>
                        </div>

                        {/* FORM */}
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5 bg-white p-6 rounded-xl shadow-md"
                        >
                            {/* PASSWORD */}
                            <div>
                                <label className="text-sm font-medium">
                                    New Password
                                </label>
                                <div className="relative mt-1">
                                    <input
                                        type={showPw ? "text" : "password"}
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        className="input-styled pr-10"
                                        placeholder="Enter new password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPw(!showPw)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                    >
                                        {showPw ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* CONFIRM PASSWORD */}
                            <div>
                                <label className="text-sm font-medium">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                    className="input-styled mt-1"
                                    placeholder="Confirm password"
                                    required
                                />
                            </div>

                            {/* BUTTON */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full py-3.5"
                            >
                                {loading ? "Updating..." : "Reset Password"}
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default ResetPassword;