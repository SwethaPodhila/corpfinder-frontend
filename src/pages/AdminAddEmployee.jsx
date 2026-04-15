import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, UploadCloud } from "lucide-react";
import AdminSidebar from "../components/layout/AdminSidebar";
import { jwtDecode } from "jwt-decode";

const AddEmployee = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [adminName, setAdminName] = useState("");
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [popup, setPopup] = useState({
        show: false,
        type: "", // success | error
        message: ""
    });

    const [formData, setFormData] = useState({
        name: "",
        designation: "",
        company: "",
        city: "",
        state: "",
        country: "",
        email: "",
        phone: "",
        industry: "",
    });

    const [file, setFile] = useState(null);

    // 🔐 Get Admin Name
    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setAdminName(decoded.username || decoded.email || "Admin");
            } catch (err) {
                console.log(err);
            }
        }
    }, []);

    // 🔹 Form Change
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // 🔹 Submit Single Employee
    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError("");
        setMessage("");

        const { name, designation, company, city, state, country } = formData;

        if (!name || !designation || !company || !city || !state || !country) {
            setError("Please fill all required fields ❗");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("http://localhost:5000/employee/add-employee", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.msg || "Something went wrong ❌");
                setLoading(false);
                return;
            }

            alert("Employee added successfully ✅");

            setFormData({
                name: "",
                designation: "",
                company: "",
                city: "",
                state: "",
                country: "",
                email: "",
                phone: "",
                industry: "",
            });

        } catch (err) {
            setError("Server error ❌");
        }

        setLoading(false);
    };

    // 🔹 File Change
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        if (!selectedFile) return;

        const allowedTypes = [
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // xlsx
            "application/vnd.ms-excel", // xls
            "text/csv"
        ];

        if (!allowedTypes.includes(selectedFile.type)) {
            alert("Only Excel or CSV files allowed ❗");
            return;
        }

        setFile(selectedFile);
    };

    const handleUpload = async () => {
        if (!file) {
            setPopup({
                show: true,
                type: "error",
                message: "⚠️ Please select a file"
            });
            return;
        }

        setUploading(true);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("http://localhost:5000/employee/upload-employees", {
                method: "POST",
                body: formData
            });

            const data = await res.json();

            let msg = "";

            // ❌ ERROR CASE
            if (!res.ok) {
                msg = `❌ ${data.msg}\n\n`;

                if (data.errors?.length) {
                    msg += "🔴 Failed Records:\n";
                    msg += data.errors.join("\n");
                }

                if (data.duplicates?.length) {
                    msg += "\n\n⚠️ Duplicates:\n";
                    msg += data.duplicates.join("\n");
                }

                setPopup({
                    show: true,
                    type: "error",
                    message: msg
                });

                setUploading(false);
                return;
            }

            // ✅ SUCCESS CASE
            msg = `📊 Upload Summary\n\n`;
            msg += `✔ Successfully Added: ${data.inserted}\n`;
            msg += `❌ Failed: ${data.errorsCount}\n`;
            msg += `⚠️ Duplicates: ${data.duplicateCount}\n\n`;

            if (data.errors?.length) {
                msg += "🔴 Failed Records:\n";
                msg += data.errors.join("\n");
            }

            if (data.duplicates?.length) {
                msg += "\n\n⚠️ Duplicate Records:\n";
                msg += data.duplicates.join("\n");
            }

            setPopup({
                show: true,
                type: "success",
                message: msg
            });

            setFile(null);

        } catch (err) {
            setPopup({
                show: true,
                type: "error",
                message: "❌ Server error"
            });
        }

        setUploading(false);
    };

    return (
        <div className="flex min-h-screen bg-gray-50">

            {/* SIDEBAR */}
            <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            <div className="flex flex-1 flex-col lg:ml-64">

                {/* HEADER */}
                <header className="sticky top-0 z-20 flex items-center justify-between border-b bg-white px-6 py-4">
                    <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
                        <Menu />
                    </button>

                    <h1 className="text-lg font-semibold">Add Employee</h1>

                    <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-xl">
                        <div className="h-8 w-8 flex items-center justify-center rounded-full bg-blue-600 text-white text-sm">
                            A
                        </div>
                        <span>{adminName}</span>
                    </div>
                </header>

                {/* MAIN */}
                <main className="p-6 grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {message && (
                        <div className="mb-4 p-3 rounded-lg bg-green-100 text-green-700 text-sm">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    {/* 🧾 FORM → 60% */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-3 bg-white p-6 rounded-2xl shadow-md border"
                    >
                        <h2 className="text-xl font-bold mb-4">Add Employee</h2>

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            <input name="name" placeholder="Full Name *" value={formData.name} onChange={handleChange} className="input-styled" required />
                            <input name="designation" placeholder="Designation *" value={formData.designation} onChange={handleChange} className="input-styled" required />
                            <input name="company" placeholder="Company *" value={formData.company} onChange={handleChange} className="input-styled" required />
                            <input name="city" placeholder="City *" value={formData.city} onChange={handleChange} className="input-styled" required />
                            <input name="state" placeholder="State *" value={formData.state} onChange={handleChange} className="input-styled" required />
                            <input name="country" placeholder="Country *" value={formData.country} onChange={handleChange} className="input-styled" required />

                            <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="input-styled" />
                            <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} className="input-styled" />

                            <div className="md:col-span-2">
                                <input name="industry" placeholder="Industry" value={formData.industry} onChange={handleChange} className="input-styled" />
                            </div>

                            <div className="md:col-span-2">
                                <button className="btn-primary w-full" disabled={loading}>
                                    {loading ? "Adding..." : "Add Employee"}
                                </button>
                            </div>

                        </form>
                    </motion.div>

                    {/* 📂 BULK UPLOAD → 40% */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-md border flex flex-col justify-center items-center"
                    >

                        <h2 className="text-xl font-bold mb-4">Bulk Upload</h2>

                        {/* 🔥 CLICKABLE UPLOAD AREA */}
                        <label className="w-full border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:bg-gray-50 transition">

                            <UploadCloud className="mx-auto mb-3 text-gray-400" size={40} />

                            <p className="text-sm text-gray-500 mb-2">
                                Click to upload Excel / CSV
                            </p>

                            {/* 🔥 Hidden file input */}
                            <input
                                type="file"
                                accept=".xlsx, .xls, .csv"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </label>

                        {/* File name show */}
                        {file && (
                            <div className="mt-3 text-sm text-blue-600">
                                Selected: {file.name}
                            </div>
                        )}

                        <button
                            onClick={handleUpload}
                            className="btn-primary w-full mt-4"
                            disabled={uploading}
                        >
                            {uploading ? "Uploading..." : "Upload File"}
                        </button>

                        <p className="text-xs text-gray-400 mt-3 text-center">
                            Format: name, designation, company, city, state, country
                        </p>

                    </motion.div>
                    {popup.show && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                            <div className="bg-white rounded-xl shadow-lg w-[400px] max-h-[80vh] overflow-auto p-5">

                                <h2 className={`text-lg font-bold mb-3 ${popup.type === "error" ? "text-red-600" : "text-green-600"
                                    }`}>
                                    {popup.type === "error" ? "❌ Upload Failed" : "✅ Upload Success"}
                                </h2>

                                <pre className="text-sm whitespace-pre-wrap text-gray-700">
                                    {popup.message}
                                </pre>

                                <button
                                    onClick={() => setPopup({ show: false, type: "", message: "" })}
                                    className="btn-primary mt-5 w-full"
                                >
                                    OK
                                </button>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default AddEmployee;