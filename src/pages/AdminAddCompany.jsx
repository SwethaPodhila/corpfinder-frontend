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
    const itemsPerPage = 20;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const currentCompanies = companies.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(companies.length / itemsPerPage);

    const token = localStorage.getItem("adminToken");

    const [popup, setPopup] = useState({
        show: false,
        type: "", // success | error
        message: ""
    });

    const [formData, setFormData] = useState({
        name: "",
        country: "",
        state: "",
        city: "",
        description: ""
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

        const { name, country, state, city } = formData;

        if (!name || !country || !state || !city) {
            setPopup({
                show: true,
                type: "error",
                message: "Please fill all required fields ❗"
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
                name: "",
                country: "",
                state: "",
                city: "",
                description: ""
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

                            <input name="name" placeholder="Company Name *" value={formData.name} onChange={handleChange} className="input-styled" required />
                            <input name="country" placeholder="Country *" value={formData.country} onChange={handleChange} className="input-styled" required />
                            <input name="state" placeholder="State *" value={formData.state} onChange={handleChange} className="input-styled" required />
                            <input name="city" placeholder="City *" value={formData.city} onChange={handleChange} className="input-styled" required />

                            <div className="md:col-span-2">
                                <input name="description" placeholder="Description (Optional)" value={formData.description} onChange={handleChange} className="input-styled" />
                            </div>

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

                    </motion.div>

                    {/* 🔥 POPUP */}
                    {popup.show && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                            <div className="bg-white rounded-xl shadow-lg w-[400px] max-h-[80vh] overflow-auto p-5">

                                <h2 className={`text-lg font-bold mb-3 ${popup.type === "error" ? "text-red-600" : "text-green-600"}`}>
                                    {popup.type === "error" ? "❌ Error" : "✅ Success"}
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
                                        <th className="p-3 text-left">City</th>
                                        <th className="p-3 text-left">State</th>
                                        <th className="p-3 text-left">Country</th>
                                        <th className="p-3 text-left">Description</th>
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
                                                    <td className="p-3">{c.name}</td>
                                                    <td className="p-3">{c.city}</td>
                                                    <td className="p-3">{c.state}</td>
                                                    <td className="p-3">{c.country}</td>

                                                    <td className="p-3 text-gray-600">
                                                        {c.description?.length > 100
                                                            ? c.description.slice(0, 100) + "..."
                                                            : c.description || "-"}
                                                    </td>

                                                    <td className="p-3 flex gap-2 justify-center">
                                                        <button
                                                            onClick={() => handleEdit(c)}
                                                            className="px-3 py-1 bg-blue-500 text-white rounded"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(c._id)}
                                                            className="px-3 py-1 bg-red-500 text-white rounded"
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
                    </div>

                    {editData && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                            <div className="bg-white p-6 rounded-xl w-[400px]">

                                <h2 className="text-lg font-bold mb-4">Update Company</h2>

                                <input
                                    value={editData.name}
                                    onChange={(e) =>
                                        setEditData({ ...editData, name: e.target.value })
                                    }
                                    className="input-styled mb-2"
                                />

                                <input
                                    value={editData.city}
                                    onChange={(e) =>
                                        setEditData({ ...editData, city: e.target.value })
                                    }
                                    className="input-styled mb-2"
                                />

                                <input
                                    value={editData.state}
                                    onChange={(e) =>
                                        setEditData({ ...editData, state: e.target.value })
                                    }
                                    className="input-styled mb-2"
                                />

                                <textarea
                                    value={editData.description}
                                    onChange={(e) =>
                                        setEditData({ ...editData, description: e.target.value })
                                    }
                                    className="input-styled mb-2"
                                />

                                <div className="flex gap-2 mt-4">
                                    <button onClick={handleUpdate} className="btn-primary w-full">
                                        Update
                                    </button>

                                    <button
                                        onClick={() => setEditData(null)}
                                        className="w-full bg-gray-300 rounded"
                                    >
                                        Cancel
                                    </button>
                                </div>

                            </div>
                        </div>
                    )}


                    <div className="flex justify-center items-center gap-2 p-4">

                        <button
                            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(currentPage - 1)}
                        >
                            Prev
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`px-3 py-1 rounded ${currentPage === i + 1
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-200"
                                    }`}
                            >
                                {i + 1}
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

                </main>
            </div>
        </div>
    );
};

export default AddCompany; 