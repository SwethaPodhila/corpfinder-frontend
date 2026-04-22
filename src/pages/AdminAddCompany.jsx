import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, UploadCloud } from "lucide-react";
import AdminSidebar from "../components/layout/AdminSidebar";
import { jwtDecode } from "jwt-decode";

const AddCompany = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [adminName, setAdminName] = useState("");
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [companies, setCompanies] = useState([]);
    const [editData, setEditData] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [userRole, setUserRole] = useState("");
    const itemsPerPage = 20;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const currentCompanies = companies.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(companies.length / itemsPerPage);

    const getPagination = () => {
        const pages = [];
        const maxVisible = 5; // how many pages to show

        let start = Math.max(1, currentPage - 2);
        let end = Math.min(totalPages, currentPage + 2);

        // adjust if near start
        if (currentPage <= 3) {
            start = 1;
            end = Math.min(totalPages, maxVisible);
        }

        // adjust if near end
        if (currentPage >= totalPages - 2) {
            start = Math.max(1, totalPages - maxVisible + 1);
            end = totalPages;
        }

        // first page + dots
        if (start > 1) {
            pages.push(1);
            if (start > 2) pages.push("...");
        }

        // middle pages
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        // last page + dots
        if (end < totalPages) {
            if (end < totalPages - 1) pages.push("...");
            pages.push(totalPages);
        }

        return pages;
    };

    const token = localStorage.getItem("adminToken");

    const [popup, setPopup] = useState({
        show: false,
        type: "", // success | error
        message: ""
    });

    const [formData, setFormData] = useState({
        company_name: "",
        company_type: "",
        company_industry: "",
        company_address: "",
        company_website: "",
        company_city: "",
        company_state: "",
        company_country: "",
        company_phone: "",
        company_email: "",
        company_linkedin_url: "",
        company_founded: "",  // ✅ added founded year
        company_description: ""   // ✅ added description field
    });

    const [file, setFile] = useState(null);

    const fetchCompanies = async () => {
        try {
            console.log("Fetching companies with token:", token);
            const res = await fetch("https://corpfinder-backend.onrender.com/company/my-companies", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await res.json();

            console.log("API RESPONSE:", data);

            if (!res.ok) {
                setCompanies([]);   // ❌ safe fallback
                return;
            }

            // ✅ ensure array always
            setCompanies(Array.isArray(data) ? data : []);

        } catch (err) {
            console.log(err);
            setCompanies([]); // ❌ prevent crash
        }
    };

    useEffect(() => {
        if (token) {
            fetchCompanies();
        }
    }, [token]);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this company?");

        if (!confirmDelete) return; // ❌ stop here if cancel

        try {
            const res = await fetch(`https://corpfinder-backend.onrender.com/company/delete/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await res.json();

            if (res.ok) {
                setCompanies((prev) => prev.filter((c) => c._id !== id));
            } else {
                console.log(data);
            }

        } catch (err) {
            console.log(err);
        }
    };

    const handleUpdate = async () => {
        try {
            const res = await fetch(`https://corpfinder-backend.onrender.com/company/update/${editData._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(editData)
            });

            const data = await res.json();

            if (res.ok) {
                setCompanies((prev) =>
                    prev.map((c) =>
                        c._id === editData._id ? data : c
                    )
                );

                setEditData(null);
                // 🔥 refresh list after update
                fetchCompanies();
            } else {
                console.log(data);
            }

        } catch (err) {
            console.log(err);
        }
    };

    const handleEdit = (company) => {
        setEditData(company);
    };

    // 🔐 Get Admin Name
    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setAdminName(decoded.username || decoded.email || "Admin");
                setUserRole(decoded.role); // 🔥 store role
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

    // 🔹 Single Company Add
    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        const { company_name, company_type, company_industry } = formData;

        if (!company_name || !company_type || !company_industry) {
            setPopup({
                show: true,
                type: "error",
                message: "Please fill required fields ❗ (Name, Type, Industry)"
            });
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("https://corpfinder-backend.onrender.com/company/add-company", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}` // 🔥 MUST
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (!res.ok) {
                setPopup({
                    show: true,
                    type: "error",
                    message: data.msg || "Something went wrong ❌"
                });
                setLoading(false);
                return;
            }

            setPopup({
                show: true,
                type: "success",
                message: "Company added successfully ✅"
            });

            setFormData({
                company_name: "",
                company_type: "",
                company_industry: "",
                company_address: "",
                company_website: "",
                company_city: "",
                company_state: "",
                company_country: "",
                company_phone: "",
                company_email: "",
                company_linkedin_url: "",
                company_founded: "",  // ✅
                company_description: ""   // ✅
            });

        } catch (err) {
            setPopup({
                show: true,
                type: "error",
                message: "Server error ❌"
            });
        }

        setLoading(false);
    };

    // 🔹 File Change
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        if (!selectedFile) return;

        const allowedTypes = [
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.ms-excel",
            "text/csv"
        ];

        if (!allowedTypes.includes(selectedFile.type)) {
            setPopup({
                show: true,
                type: "error",
                message: "Only Excel or CSV files allowed ❗"
            });
            return;
        }

        setFile(selectedFile);
    };

    // 🔹 Bulk Upload
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
            const res = await fetch("https://corpfinder-backend.onrender.com/company/upload-companies", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}` // 🔥 MUST
                },
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

                    <h1 className="text-lg font-semibold">Add Company</h1>

                    <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-xl">
                        <div className="h-8 w-8 flex items-center justify-center rounded-full bg-blue-600 text-white text-sm">
                            A
                        </div>
                        <span>{adminName}</span>
                    </div>
                </header>

                {/* MAIN */}
                <main className="p-6 grid grid-cols-1 lg:grid-cols-5 gap-6 flex-1 w-full">

                    {/* 🧾 FORM */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-3 bg-white p-6 rounded-2xl shadow-md border"
                    >
                        <h2 className="text-xl font-bold mb-4">Add Company</h2>

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            <input name="company_name" placeholder="Company Name *" value={formData.company_name} onChange={handleChange} className="input-styled" />

                            <input name="company_type" placeholder="Company Type *" value={formData.company_type} onChange={handleChange} className="input-styled" />

                            <input name="company_industry" placeholder="Industry *" value={formData.company_industry} onChange={handleChange} className="input-styled" />

                            <input name="company_city" placeholder="City" value={formData.company_city} onChange={handleChange} className="input-styled" />

                            <input name="company_state" placeholder="State" value={formData.company_state} onChange={handleChange} className="input-styled" />

                            <input name="company_country" placeholder="Country" value={formData.company_country} onChange={handleChange} className="input-styled" />

                            <input name="company_address" placeholder="Address" value={formData.company_address} onChange={handleChange} className="input-styled" />

                            <input name="company_website" placeholder="Website" value={formData.company_website} onChange={handleChange} className="input-styled" />

                            <input name="company_phone" placeholder="Phone" value={formData.company_phone} onChange={handleChange} className="input-styled" />

                            <input name="company_email" placeholder="Email" value={formData.company_email} onChange={handleChange} className="input-styled" />

                            <input name="company_linkedin_url" placeholder="LinkedIn URL" value={formData.company_linkedin_url} onChange={handleChange} className="input-styled" />

                            <input name="company_founded" placeholder="Founded Year (e.g. 2010)" value={formData.company_founded} onChange={handleChange} className="input-styled" />

                            <textarea
                                name="company_description"
                                placeholder="Company Description (Optional)"
                                value={formData.company_description}
                                onChange={handleChange}
                                className="input-styled md:col-span-2"
                            />

                            <div className="md:col-span-2">
                                <button className="btn-primary w-full" disabled={loading}>
                                    {loading ? "Adding..." : "Add Company"}
                                </button>
                            </div>

                        </form>
                    </motion.div>

                    {/* 📂 BULK UPLOAD */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-md border flex flex-col justify-center items-center"
                    >

                        <h2 className="text-xl font-bold mb-4">Bulk Upload</h2>

                        <label className="w-full border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:bg-gray-50">

                            <UploadCloud className="mx-auto mb-3 text-gray-400" size={40} />

                            <p className="text-sm text-gray-500 mb-2">
                                Click to upload Excel / CSV
                            </p>

                            <input
                                type="file"
                                accept=".xlsx, .xls, .csv"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </label>

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
                            Format: company name, city, state, country
                        </p>

                    </motion.div>

                    {/* 🔥 POPUP */}
                    {popup.show && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">

                            <div className="bg-white rounded-xl shadow-lg w-[400px] max-h-[80vh] flex flex-col">

                                {/* HEADER */}
                                <div className="p-5 border-b">
                                    <h2 className={`text-lg font-bold ${popup.type === "error" ? "text-red-600" : "text-green-600"}`}>
                                        {popup.type === "error" ? "❌ Error" : "✅ Success"}
                                    </h2>
                                </div>

                                {/* SCROLLABLE CONTENT */}
                                <div className="p-5 overflow-y-auto flex-1">
                                    <pre className="text-sm whitespace-pre-wrap text-gray-700">
                                        {popup.message}
                                    </pre>
                                </div>

                                {/* FIXED FOOTER */}
                                <div className="p-4 border-t bg-white">
                                    <button
                                        onClick={() => setPopup({ show: false, type: "", message: "" })}
                                        className="btn-primary w-full"
                                    >
                                        OK
                                    </button>
                                </div>

                            </div>
                        </div>
                    )}

                    {/* 🔥 TABLE WRAPPER FIX */}
                    <div className="lg:col-span-5 mt-6 bg-white rounded-2xl shadow-md border w-full">

                        {/* HEADER */}
                        <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Company List</h2>
                            <span className="text-sm text-gray-500">
                                Total companies: {companies.length}
                            </span>
                        </div>

                        <div className="overflow-x-auto w-full">
                            <table className="w-full min-w-[700px] text-sm">

                                <thead className="bg-gray-100 text-gray-700">
                                    <tr>
                                        <th className="p-3 text-left">Name</th>
                                        <th className="p-3 text-left">Type</th>
                                        <th className="p-3 text-left">Industry</th>
                                        <th className="p-3 text-left">City</th>
                                        <th className="p-3 text-left">State</th>
                                        <th className="p-3 text-left">Country</th>
                                        <th className="p-3 text-left">Email</th>
                                        <th className="p-3 text-left">Phone</th>
                                        <th className="p-3 text-left">Website</th>
                                        <th className="p-3 text-left">Founded</th>
                                        <th className="p-3 text-left">Address</th>
                                        <th className="p-3 text-center">Actions</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {/* EMPTY STATE INSIDE TBODY */}
                                    {companies.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="p-10 text-center">
                                                <div className="text-5xl mb-3">🏢</div>
                                                <h2 className="text-lg font-semibold text-gray-700">
                                                    No Companies Found
                                                </h2>
                                                <p className="text-sm text-gray-500 mt-2">
                                                    Add company or upload Excel file
                                                </p>
                                            </td>
                                        </tr>
                                    ) : (
                                        <>
                                            {/* SUMMARY ROW 
                                            <tr className="bg-gray-50">
                                                <td colSpan="6" className="p-3 text-right text-sm text-gray-600">
                                                    Total Companies: {companies.length}
                                                </td>
                                            </tr>*/}

                                            {/* DATA ROWS */}
                                            {currentCompanies.map((c) => (
                                                <tr key={c._id} className="border-t hover:bg-gray-50">
                                                    <td className="p-3">{c.company_name}</td>
                                                    <td className="p-3">{c.company_type}</td>
                                                    <td className="p-3">{c.company_industry}</td>
                                                    <td className="p-3">{c.company_city || "-"}</td>
                                                    <td className="p-3">{c.company_state || "-"}</td>
                                                    <td className="p-3">{c.company_country || "-"}</td>
                                                    <td className="p-3">{c.company_email || "-"}</td>
                                                    <td className="p-3">{c.company_phone || "-"}</td>
                                                    <td className="p-3">{c.company_website || "-"}</td>
                                                    <td className="p-3">{c.company_founded || "-"}</td>
                                                    <td className="p-3">{c.company_address || "-"}</td>

                                                    <td className="p-3 flex gap-2 justify-center">
                                                        <button
                                                            onClick={() => handleEdit(c)}
                                                            className="px-3 py-1 bg-blue-500 text-white rounded"
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            onClick={() => {
                                                                if (userRole !== "superadmin") {
                                                                    setPopup({
                                                                        show: true,
                                                                        type: "error",
                                                                        message: "❌ You don't have permission"
                                                                    });
                                                                    return;
                                                                }
                                                                handleDelete(c._id);
                                                            }}
                                                            className={`px-3 py-1 rounded text-white ${userRole !== "superadmin"
                                                                ? "bg-red-300 cursor-not-allowed"
                                                                : "bg-red-500"
                                                                }`}
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </>
                                    )}

                                </tbody>

                            </table>
                        </div>

                        <div className="flex justify-center items-center gap-2 p-4">

                            <button
                                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(currentPage - 1)}
                            >
                                Prev
                            </button>

                            {getPagination().map((page, index) => (
                                <button
                                    key={index}
                                    disabled={page === "..."}
                                    onClick={() => page !== "..." && setCurrentPage(page)}
                                    className={`px-3 py-1 rounded ${currentPage === page
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-200"
                                        } ${page === "..." ? "cursor-default" : ""}`}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(currentPage + 1)}
                            >
                                Next
                            </button>

                        </div>

                    </div>

                    {editData && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">

                            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl p-6 max-h-[90vh] overflow-y-auto">

                                {/* HEADER */}
                                <div className="flex justify-between items-center mb-4 border-b pb-2">
                                    <h2 className="text-xl font-semibold">Update Company</h2>
                                    <button
                                        onClick={() => setEditData(null)}
                                        className="text-gray-500 hover:text-red-500 text-lg"
                                    >
                                        ✕
                                    </button>
                                </div>

                                {/* FORM */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                    <input
                                        value={editData.company_name || ""}
                                        onChange={(e) => setEditData({ ...editData, company_name: e.target.value })}
                                        className="input-styled"
                                        placeholder="Company Name *"
                                    />

                                    <input
                                        value={editData.company_type || ""}
                                        onChange={(e) => setEditData({ ...editData, company_type: e.target.value })}
                                        className="input-styled"
                                        placeholder="Company Type *"
                                    />

                                    <input
                                        value={editData.company_industry || ""}
                                        onChange={(e) => setEditData({ ...editData, company_industry: e.target.value })}
                                        className="input-styled"
                                        placeholder="Industry *"
                                    />

                                    <input
                                        value={editData.company_founded || ""}
                                        onChange={(e) => setEditData({ ...editData, company_founded: e.target.value })}
                                        className="input-styled"
                                        placeholder="Founded Year (e.g. 2010)"
                                    />

                                    <input
                                        value={editData.company_city || ""}
                                        onChange={(e) => setEditData({ ...editData, company_city: e.target.value })}
                                        className="input-styled"
                                        placeholder="City"
                                    />

                                    <input
                                        value={editData.company_state || ""}
                                        onChange={(e) => setEditData({ ...editData, company_state: e.target.value })}
                                        className="input-styled"
                                        placeholder="State"
                                    />

                                    <input
                                        value={editData.company_country || ""}
                                        onChange={(e) => setEditData({ ...editData, company_country: e.target.value })}
                                        className="input-styled"
                                        placeholder="Country"
                                    />

                                    <input
                                        value={editData.company_email || ""}
                                        onChange={(e) => setEditData({ ...editData, company_email: e.target.value })}
                                        className="input-styled"
                                        placeholder="Email"
                                    />

                                    <input
                                        value={editData.company_phone || ""}
                                        onChange={(e) => setEditData({ ...editData, company_phone: e.target.value })}
                                        className="input-styled"
                                        placeholder="Phone"
                                    />

                                    <input
                                        value={editData.company_website || ""}
                                        onChange={(e) => setEditData({ ...editData, company_website: e.target.value })}
                                        className="input-styled"
                                        placeholder="Website"
                                    />

                                    <input
                                        value={editData.company_linkedin_url || ""}
                                        onChange={(e) => setEditData({ ...editData, company_linkedin_url: e.target.value })}
                                        className="input-styled"
                                        placeholder="LinkedIn URL"
                                    />

                                    {/* FULL WIDTH */}
                                    <input
                                        value={editData.company_address || ""}
                                        onChange={(e) => setEditData({ ...editData, company_address: e.target.value })}
                                        className="input-styled"
                                        placeholder="Full Address"
                                    />

                                    <textarea
                                        value={editData.company_description || ""}
                                        onChange={(e) => setEditData({ ...editData, company_description: e.target.value })}
                                        className="input-styled md:col-span-2"
                                        placeholder="Company Description"
                                    />

                                </div>

                                {/* ACTIONS */}
                                <div className="flex gap-3 mt-6">
                                    <button
                                        onClick={handleUpdate}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl"
                                    >
                                        Update
                                    </button>

                                    <button
                                        onClick={() => setEditData(null)}
                                        className="flex-1 bg-gray-200 hover:bg-gray-300 py-2 rounded-xl"
                                    >
                                        Cancel
                                    </button>
                                </div>

                            </div>
                        </div>
                    )}

                </main>



            </div>
        </div>
    );
};

export default AddCompany; 