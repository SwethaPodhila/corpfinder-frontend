import React, { useState } from "react";
import { motion } from "framer-motion";
import { Menu, UploadCloud } from "lucide-react";
import AdminSidebar from "../components/layout/AdminSidebar";

const AddEmployee = () => {

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [popup, setPopup] = useState({ show: false, type: "", message: "" });

    const token = localStorage.getItem("adminToken");
    const adminName = localStorage.getItem("adminName");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("http://localhost:5000/employees/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                // ✅ RESET FORM
                setFormData({});
            }

            setPopup({
                show: true,
                type: res.ok ? "success" : "error",
                message: data.msg
            });

        } catch {
            setPopup({
                show: true,
                type: "error",
                message: "Server error ❌"
            });
        }

        setLoading(false);
    };

    const handleUpload = async () => {
        if (!file) {
            return setPopup({ show: true, type: "error", message: "Select file ❗" });
        }

        setUploading(true);

        const fd = new FormData();
        fd.append("file", file);

        try {
            const res = await fetch("http://localhost:5000/employees/upload", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: fd
            });

            const data = await res.json();

            let msg = `📊 Upload Summary\n\n`;
            msg += `✔ Inserted: ${data.inserted}\n`;
            msg += `❌ Errors: ${data.errorsCount}\n`;
            msg += `⚠️ Duplicates: ${data.duplicateCount}\n`;

            // 🔴 Show errors
            if (data.errors?.length) {
                msg += `\n\n🔴 Failed Records:\n${data.errors.join("\n")}`;
            }

            // ⚠️ Show duplicates
            if (data.duplicates?.length) {
                msg += `\n\n⚠️ Duplicate Records:\n${data.duplicates.join("\n")}`;
            }

            // ✅ Reset file after success
            if (res.ok) {
                setFile(null);
            }

            setPopup({
                show: true,
                type: res.ok ? "success" : "error",
                message: msg
            });

        } catch {
            setPopup({
                show: true,
                type: "error",
                message: "Upload failed ❌"
            });
        }

        setUploading(false);
    };

    return (
        <div className="flex min-h-screen bg-gray-50">

            <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            <div className="flex flex-1 flex-col lg:ml-64">

                {/* HEADER */}
                <header className="flex justify-between bg-white p-4 border-b">
                    <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
                        <Menu />
                    </button>
                    <h1 className="font-semibold text-lg">Add Employee</h1>
                    <span className="text-sm text-gray-600">{adminName}</span>
                </header>

                <main className="p-6 space-y-6">

                    {/* 🔥 BULK UPLOAD TOP */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                        {/* 🔹 LEFT → 40% */}
                        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow border">

                            <h2 className="font-bold text-lg mb-4">📂 Bulk Upload</h2>

                            <label className="border-2 border-dashed p-8 rounded-xl text-center cursor-pointer hover:bg-gray-50 transition block">

                                <UploadCloud className="mx-auto mb-3 text-blue-500" size={42} />

                                <p className="text-gray-600 font-medium">
                                    Click to upload Excel / CSV
                                </p>

                                <p className="text-xs text-gray-400 mt-1">
                                    Supported: .xlsx, .xls, .csv
                                </p>

                                <input
                                    type="file"
                                    accept=".xlsx,.xls,.csv"
                                    className="hidden"
                                    onChange={(e) => setFile(e.target.files[0])}
                                />
                            </label>

                            {file && (
                                <div className="mt-3 text-sm text-green-600 font-medium">
                                    ✅ {file.name}
                                </div>
                            )}

                            <button
                                onClick={handleUpload}
                                disabled={!file || uploading}
                                className="btn-primary mt-5 w-full disabled:opacity-50"
                            >
                                {uploading ? "Uploading..." : "Upload File"}
                            </button>
                            <p className="text-xs text-gray-400 mt-1 text-center">Please read instruction before you upload</p>

                        </div>


                        {/* 🔹 RIGHT → 60% */}
                        {/* 📌 RIGHT SIDE - INSTRUCTIONS */}
                        <div className="lg:col-span-3">

                            <div className="bg-white p-6 rounded-2xl shadow h-[420px] overflow-y-auto">

                                <h2 className="font-bold mb-4 text-lg">📌 Upload Instructions</h2>

                                <h3 className="text-red-500 font-semibold mb-2">Required Fields *</h3>

                                <div className="grid grid-cols-2 gap-2 text-sm text-gray-700 mb-4">
                                    <p>first_name</p>
                                    <p>designation</p>
                                    <p>personal_email</p>
                                    <p>phone</p>
                                    <p>city</p>
                                    <p>country</p>
                                    <p>company_name</p>
                                    <p>company_email</p>
                                    <p>company_phone</p>
                                    <p>company_type</p>
                                    <p>company_industry</p>
                                </div>

                                <h3 className="text-gray-700 font-semibold mb-2">Optional Fields</h3>

                                <p className="text-sm text-gray-600 mb-4 leading-6">
                                    last_name, business_email, state, linkedin_id, linkedin_url, description,
                                    company_address, company_website, company_city, company_state,
                                    company_country, company_linkedin_url, company_founded, company_description
                                </p>

                                <h3 className="font-semibold mb-2">📊 Example Row</h3>

                                <div className="bg-gray-100 p-3 rounded text-xs text-gray-700 mb-4">
                                    first_name: John | designation: Developer | personal_email: john@gmail.com | phone: 9999999999 |
                                    city: Hyderabad | country: India | company_name: TCS | company_email: hr@tcs.com |
                                    company_phone: 8888888888 | company_type: IT | company_industry: Software
                                </div>

                                <div className="text-xs text-yellow-600 space-y-1">
                                    <p>⚠ Column names must be lowercase</p>
                                    <p>⚠ Duplicate records will be skipped</p>
                                </div>

                            </div>
                        </div>

                    </div>


                    {/* 🔥 FORM TWO COLUMN */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                    >

                        {/* 👤 EMPLOYEE */}
                        <div className="bg-white p-6 rounded-2xl shadow">
                            <h2 className="font-bold mb-4 text-blue-600">Employee Details</h2>

                            <div className="grid gap-3">

                                <input name="first_name" placeholder="First Name *" onChange={handleChange} className="input-styled" required />
                                <input name="last_name" placeholder="Last Name" onChange={handleChange} className="input-styled" />

                                <input name="designation" placeholder="Designation *" onChange={handleChange} className="input-styled" required />

                                <input name="personal_email" placeholder="Personal Email *" onChange={handleChange} className="input-styled" required />
                                <input name="business_email" placeholder="Business Email" onChange={handleChange} className="input-styled" />

                                <input name="phone" placeholder="Phone *" onChange={handleChange} className="input-styled" required />

                                <input name="city" placeholder="City *" onChange={handleChange} className="input-styled" required />
                                <input name="state" placeholder="State" onChange={handleChange} className="input-styled" />
                                <input name="country" placeholder="Country *" onChange={handleChange} className="input-styled" required />

                                <input name="linkedin_id" placeholder="LinkedIn ID" onChange={handleChange} className="input-styled" />
                                <input name="linkedin_url" placeholder="LinkedIn URL" onChange={handleChange} className="input-styled" />

                                <input name="description" placeholder="Description" onChange={handleChange} className="input-styled" />

                            </div>
                        </div>

                        {/* 🏢 COMPANY */}
                        <div className="bg-white p-6 rounded-2xl shadow">
                            <h2 className="font-bold mb-4 text-green-600">Company Details</h2>

                            <div className="grid gap-3">

                                <input name="company_name" placeholder="Company Name *" onChange={handleChange} className="input-styled" required />
                                <input name="company_email" placeholder="Company Email *" onChange={handleChange} className="input-styled" required />

                                <input name="company_phone" placeholder="Company Phone *" onChange={handleChange} className="input-styled" required />
                                <input name="company_type" placeholder="Company Type *" onChange={handleChange} className="input-styled" required />

                                <input name="company_industry" placeholder="Industry *" onChange={handleChange} className="input-styled" required />
                                <input name="company_website" placeholder="Website" onChange={handleChange} className="input-styled" />

                                <input name="company_city" placeholder="Company City" onChange={handleChange} className="input-styled" />
                                <input name="company_state" placeholder="Company State" onChange={handleChange} className="input-styled" />

                                <input name="company_country" placeholder="Company Country" onChange={handleChange} className="input-styled" />
                                <input name="company_address" placeholder="Address" onChange={handleChange} className="input-styled" />

                                <input name="company_linkedin_url" placeholder="LinkedIn URL" onChange={handleChange} className="input-styled" />
                                <input name="company_founded" placeholder="Founded Year" onChange={handleChange} className="input-styled" />

                                <input name="company_description" placeholder="Company Description" onChange={handleChange} className="input-styled" />

                            </div>
                        </div>

                    </motion.div>

                    {/* SUBMIT */}
                    <button
                        type="button" onClick={handleSubmit}
                        className="btn-primary w-full"
                        disabled={loading}
                    >
                        {loading ? "Adding..." : "Add Employee"}
                    </button>

                </main>

                {/* POPUP */}
                {popup.show && (
                    <div className="fixed inset-0 flex justify-center items-center bg-black/40 z-50">

                        <div className="bg-white p-5 rounded-lg w-[400px] max-h-[80vh] flex flex-col">

                            {/* HEADER */}
                            <h2 className="font-semibold mb-3 text-center">
                                Notification
                            </h2>

                            {/* SCROLLABLE CONTENT */}
                            <div className="overflow-y-auto text-sm whitespace-pre-wrap flex-1 p-2 border rounded">
                                {popup.message}
                            </div>

                            {/* BUTTON */}
                            <button
                                onClick={() => setPopup({ show: false })}
                                className="btn-primary w-full mt-3"
                            >
                                OK
                            </button>

                        </div>

                    </div>
                )}

            </div>
        </div>
    );
};

export default AddEmployee;
