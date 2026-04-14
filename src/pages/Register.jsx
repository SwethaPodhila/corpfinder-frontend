import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Building2, Eye, EyeOff } from "lucide-react";
import authImg from "../assets/auth-illustration.jpg";

const Register = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirm: "",
    });

    const [showPw, setShowPw] = useState(false);
    const navigate = useNavigate();

    // 👉 OTP STATES (ADDED ONLY)
    const [step, setStep] = useState("register"); // register | otp
    const [otp, setOtp] = useState("");
    const [email, setEmail] = useState("");

    // 👉 TIMER STATES (ADDED ONLY)
    const [time, setTime] = useState(120);
    const [canResend, setCanResend] = useState(false);

    const update = (key, value) => {
        setForm({ ...form, [key]: value });
    };

    // ⏱ TIMER LOGIC (ADDED ONLY)
    useEffect(() => {
        if (step !== "otp") return;

        if (time === 0) {
            setCanResend(true);
            return;
        }

        const interval = setInterval(() => {
            setTime((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [time, step]);

    const startTimer = () => {
        setTime(120);
        setCanResend(false);
    };

    // 🔥 REGISTER API (REPLACED LOGIC ONLY)
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.password !== form.confirm) {
            alert("Passwords not matching");
            return;
        }

        const res = await fetch("http://localhost:5000/user/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                fullName: form.name,
                email: form.email,
                phone: form.phone,
                password: form.password,
                planId: 1
            }),
        });

        const data = await res.json();

        if (res.ok) {
            setEmail(form.email);
            setStep("otp");   // 👉 SWITCH TO OTP SCREEN
            startTimer();
        } else {
            alert(data.msg);
        }
    };

    // 🔐 VERIFY OTP (ADDED ONLY)
    const verifyOtp = async () => {
        try {
            const res = await fetch("http://localhost:5000/user/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp }),
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.msg);
                return;
            }

            // ✅ SAVE SAME LIKE LOGIN
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            alert("Account verified 🎉");

            navigate("/dashboard"); // direct dashboard ki vellachu

        } catch (err) {
            console.log(err);
            alert("Server error");
        }
    };

    // 🔁 RESEND OTP (ADDED ONLY)
    const resendOtp = async () => {
        const res = await fetch("http://localhost:5000/user/resend-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });

        if (res.ok) {
            startTimer();
        }
    };

    return (
        <div className="flex min-h-screen">

            {/* LEFT IMAGE (NO CHANGE) */}
            <div className="hidden w-1/2 lg:block relative">
                <img
                    src={authImg}
                    alt="Register"
                    className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/80 to-indigo-600/40 flex items-end p-12">
                    <div>
                        <h2 className="font-heading text-3xl font-bold text-primary-foreground">
                            Join CorpFinder
                        </h2>
                        <p className="mt-2 text-indigo-100">
                            Create your free account and start discovering.
                        </p>
                    </div>
                </div>
            </div>

            {/* RIGHT FORM (NO UI CHANGE) */}
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
                            CorpFinder
                        </span>

                    </Link>

                    <h1 className="font-heading text-2xl font-bold text-foreground">
                        Create your account
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        Start with a free plan. No credit card required.
                    </p>

                    {/* ================= REGISTER FORM ================= */}
                    {step === "register" && (
                        <form onSubmit={handleSubmit} className="mt-8 space-y-4">

                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => update("name", e.target.value)}
                                className="input-styled"
                                placeholder="Full Name"
                                required
                            />

                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) => update("email", e.target.value)}
                                className="input-styled"
                                placeholder="Email"
                                required
                            />

                            <input
                                type="text"
                                value={form.phone}
                                onChange={(e) => update("phone", e.target.value)}
                                className="input-styled"
                                placeholder="Phone Number"
                                required
                            />

                            <div className="relative">
                                <input
                                    type={showPw ? "text" : "password"}
                                    value={form.password}
                                    onChange={(e) => update("password", e.target.value)}
                                    className="input-styled pr-10"
                                    placeholder="Password"
                                    required
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPw(!showPw)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                >
                                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>

                            <input
                                type="password"
                                value={form.confirm}
                                onChange={(e) => update("confirm", e.target.value)}
                                className="input-styled"
                                placeholder="Confirm Password"
                                required
                            />

                            <button type="submit" className="btn-primary w-full py-3.5">
                                Create Account
                            </button>
                            <p className="mt-6 text-center text-sm text-muted-foreground">
                                Already have an account?{" "}
                                <Link
                                    to="/login"
                                    className="font-semibold text-primary hover:underline"
                                >
                                    Login here
                                </Link>
                            </p>
                        </form>
                    )}

                    {/* ================= OTP SECTION (ONLY ADDED) ================= */}
                    {step === "otp" && (
                        <div className="mt-6 space-y-4">

                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="input-styled"
                                placeholder="Enter OTP"
                            />

                            <button
                                onClick={verifyOtp}
                                className="btn-primary w-full py-3"
                            >
                                Verify OTP
                            </button>

                            <p className="text-sm text-muted-foreground">
                                Time left: {time}s
                            </p>

                            <button
                                disabled={!canResend}
                                onClick={resendOtp}
                                className={`w-full py-2 rounded ${canResend
                                    ? "bg-green-500 text-white"
                                    : "bg-gray-300"
                                    }`}
                            >
                                Resend OTP
                            </button>
                        </div>
                    )}

                </motion.div>
            </div>
        </div>
    );
};

export default Register;