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

    const [employees, setEmployees] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [userRole, setUserRole] = useState("");

    const [error, setError] = useState("");
    const [popup, setPopup] = useState({
        show: false,
        type: "", // success | error
        message: ""
    });
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 20;

    const indexOfLast = currentPage * recordsPerPage;
    const indexOfFirst = indexOfLast - recordsPerPage;

    const currentEmployees = employees.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(employees.length / recordsPerPage);


    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(prev => prev - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
    };

    const fetchEmployees = async () => {
        try {
            const res = await fetch("https://corpfinder-backend.onrender.com/employee/my-employees", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("adminToken")}`
                }
            });

            const data = await res.json();
            setEmployees(data);

        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

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
        description: "",
    });

    const [file, setFile] = useState(null);

    // 🔐 Get Admin Name
    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setAdminName(decoded.username || decoded.email || "Admin");
                setUserRole(decoded.role);
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
            const res = await fetch("https://corpfinder-backend.onrender.com/employee/add-employee", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("adminToken")}`
                },
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
                description: "",
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
            const res = await fetch("https://corpfinder-backend.onrender.com/employee/upload-employees", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("adminToken")}`
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

    const handleDelete = async (id) => {
        try {
            const confirmDelete = window.confirm("Are you sure you want to delete?");
            if (!confirmDelete) return;

            const res = await fetch(`https://corpfinder-backend.onrender.com/employee/delete-employee/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("adminToken")}`
                }
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.msg || "Delete failed ❌");
                return;
            }

            alert("Employee deleted successfully ✅");

            setCurrentPage(1); // 🔥 reset pagination
            fetchEmployees();

        } catch (err) {
            console.log(err);
            alert("Server error ❌");
        }
    };

    const handleUpdate = async () => {
        try {
            const res = await fetch(
                `https://corpfinder-backend.onrender.com/employee/update-employee/${editingId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("adminToken")}`
                    },
                    body: JSON.stringify(editForm)
                }
            );

            const data = await res.json();

            if (!res.ok) {
                alert(data.msg || "Update failed ❌");
                return;
            }

            alert("Employee updated successfully ✅");

            setEditingId(null); // close modal
            fetchEmployees();

        } catch (err) {
            console.log(err);
            alert("Server error ❌");
        }
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
                <main className="p-6 grid grid-cols-1 lg:grid-cols-5 gap-6 flex-1 w-full">

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
                                <input name="description" placeholder="description..." value={formData.description} onChange={handleChange} className="input-styled" />
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

                    <div className="lg:col-span-5 mt-6 bg-white rounded-2xl shadow-md border w-full">

                        {/* HEADER */}
                        <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Employees List</h2>
                            <span className="text-sm text-gray-500">
                                Total employees: {employees.length}
                            </span>
                        </div>

                        {/* ✅ EMPTY STATE */}
                        {employees.length === 0 ? (
                            <div className="text-center py-10">
                                <p className="text-gray-500 text-lg">
                                    😕 No employees found
                                </p>
                                <p className="text-sm text-gray-400 mt-1">
                                    Please add or upload employees to see them here
                                </p>
                            </div>
                        ) : (
                            /* ✅ TABLE */
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse min-w-[600px] text-sm">

                                    <thead className="bg-gray-100 text-left">
                                        <tr>
                                            <th className="p-3">Name</th>
                                            <th className="p-3">Designation</th>
                                            <th className="p-3">Company</th>
                                            <th className="p-3">City</th>
                                            <th className="p-3">State</th>
                                            <th className="p-3">Country</th>
                                            <th className="p-3">Email</th>
                                            <th className="p-3">Phone</th>
                                            <th className="p-3">Actions</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {currentEmployees.map(emp => (
                                            <tr key={emp._id} className="border-b hover:bg-gray-50">

                                                <td className="p-3">{emp.name}</td>
                                                <td className="p-3">{emp.designation}</td>
                                                <td className="p-3">{emp.company}</td>
                                                <td className="p-3">{emp.city}</td>
                                                <td className="p-3">{emp.state}</td>
                                                <td className="p-3">{emp.country}</td>
                                                <td className="p-3">{emp.email}</td>
                                                <td className="p-3">{emp.phone}</td>

                                                <td className="p-3 flex gap-2 justify-center">

                                                    {/* EDIT */}
                                                    <button
                                                        onClick={() => {
                                                            setEditingId(emp._id);
                                                            setEditForm(emp);
                                                        }}
                                                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                                    >
                                                        Edit
                                                    </button>

                                                    {/* DELETE */}
                                                    <button
                                                        onClick={() => {
                                                            if (userRole !== "superadmin") {
                                                                setPopup({
                                                                    show: true,
                                                                    type: "error",
                                                                    message: "❌ You don't have permission to delete employees"
                                                                });
                                                                return;
                                                            }
                                                            handleDelete(emp._id);
                                                        }}
                                                        className={`px-3 py-1 text-white rounded ${userRole !== "superadmin"
                                                            ? "bg-red-300 cursor-not-allowed"
                                                            : "bg-red-500 hover:bg-red-600"
                                                            }`}
                                                    >
                                                        Delete
                                                    </button>

                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>

                                </table>
                            </div>
                        )}

                        <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-4 border-t bg-gray-50">

                            {/* LEFT INFO */}
                            <p className="text-sm text-gray-600">
                                Showing {employees.length === 0 ? 0 : indexOfFirst + 1} to{" "}
                                {Math.min(indexOfLast, employees.length)} of {employees.length} entries
                            </p>

                            {/* RIGHT CONTROLS */}
                            <div className="flex items-center gap-2 flex-wrap justify-center">

                                {/* PREV */}
                                <button
                                    onClick={handlePrev}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1 rounded-lg border text-sm hover:bg-gray-100 disabled:opacity-40"
                                >
                                    Prev
                                </button>

                                {/* PAGE NUMBERS */}
                                {Array.from({ length: totalPages }, (_, i) => i + 1)
                                    .slice(
                                        Math.max(0, currentPage - 3),
                                        Math.min(totalPages, currentPage + 2)
                                    )
                                    .map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`px-3 py-1 rounded-lg text-sm border transition 
                        ${currentPage === page
                                                    ? "bg-blue-600 text-white border-blue-600"
                                                    : "hover:bg-gray-100"
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}

                                {/* NEXT */}
                                <button
                                    onClick={handleNext}
                                    disabled={currentPage === totalPages || totalPages === 0}
                                    className="px-3 py-1 rounded-lg border text-sm hover:bg-gray-100 disabled:opacity-40"
                                >
                                    Next
                                </button>

                            </div>
                        </div>

                    </div>
                </main>


                {editingId && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">

                        <div className="bg-white p-6 rounded-xl w-[500px] shadow-lg max-h-[90vh] overflow-y-auto">

                            <h2 className="text-lg font-bold mb-4">Edit Employee</h2>

                            {/* GRID FORM */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                                <input
                                    value={editForm.name || ""}
                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                    className="input-styled"
                                    placeholder="Name"
                                />

                                <input
                                    value={editForm.designation || ""}
                                    onChange={(e) => setEditForm({ ...editForm, designation: e.target.value })}
                                    className="input-styled"
                                    placeholder="Designation"
                                />

                                <input
                                    value={editForm.company || ""}
                                    onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                                    className="input-styled"
                                    placeholder="Company"
                                />

                                <input
                                    value={editForm.city || ""}
                                    onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                                    className="input-styled"
                                    placeholder="City"
                                />

                                <input
                                    value={editForm.state || ""}
                                    onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
                                    className="input-styled"
                                    placeholder="State"
                                />

                                <input
                                    value={editForm.country || ""}
                                    onChange={(e) => setEditForm({ ...editForm, country: e.target.value })}
                                    className="input-styled"
                                    placeholder="Country"
                                />

                                <input
                                    value={editForm.email || ""}
                                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                    className="input-styled"
                                    placeholder="Email"
                                />

                                <input
                                    value={editForm.phone || ""}
                                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                    className="input-styled"
                                    placeholder="Phone"
                                />

                                <div className="md:col-span-2">
                                    <input
                                        value={editForm.industry || ""}
                                        onChange={(e) => setEditForm({ ...editForm, industry: e.target.value })}
                                        className="input-styled"
                                        placeholder="Industry"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <textarea
                                        value={editForm.description || ""}
                                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                        className="input-styled"
                                        placeholder="Description"
                                    />
                                </div>

                            </div>

                            {/* ACTIONS */}
                            <div className="flex gap-2 mt-5">
                                <button
                                    onClick={handleUpdate}
                                    className="btn-primary w-full"
                                >
                                    Save Changes
                                </button>

                                <button
                                    onClick={() => setEditingId(null)}
                                    className="w-full border rounded text-red-500"
                                >
                                    Cancel
                                </button>
                            </div>

                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddEmployee;
