import React, { useEffect, useState } from "react";
import { Menu, Search } from "lucide-react";
import AdminSidebar from "../components/layout/AdminSidebar";
import { jwtDecode } from "jwt-decode";

const ViewData = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [adminName, setAdminName] = useState("");

    const [employees, setEmployees] = useState([]);
    const [companies, setCompanies] = useState([]);

    const [empPage, setEmpPage] = useState(1);
    const [compPage, setCompPage] = useState(1);

    const [empSearch, setEmpSearch] = useState("");
    const [compSearch, setCompSearch] = useState("");
    const [adminRole, setAdminRole] = useState("");

    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});

    const [editingCompanyId, setEditingCompanyId] = useState(null);
    const [companyForm, setCompanyForm] = useState({});

    const recordsPerPage = 10;

    // 🔐 Get Admin Name
    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setAdminName(decoded.username || decoded.email || "Admin");
                setAdminRole(decoded.role); // 👈 ADD THIS
            } catch (err) {
                console.log(err);
            }
        }

        fetchAllEmployees();
        fetchAllCompanies();
    }, []);

    const fetchAllEmployees = async () => {
        const res = await fetch("https://corpfinder-backend.onrender.com/employee/all", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("adminToken")}`
            }
        });
        const data = await res.json();
        setEmployees(data);
    };

    const fetchAllCompanies = async () => {
        const res = await fetch("https://corpfinder-backend.onrender.com/company/all", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("adminToken")}`
            }
        });
        const data = await res.json();
        setCompanies(data);
    };

    const handleEdit = (emp) => {
        setEditingId(emp._id);

        setEditForm({
            name: emp.name || "",
            designation: emp.designation || "",
            company: emp.company || "",
            city: emp.city || "",
            state: emp.state || "",
            country: emp.country || "",
            email: emp.email || "",
            phone: emp.phone || "",
            industry: emp.industry || "",
            description: emp.description || "",
        });
    };

    const handleDelete = async (id) => {
        //console.log("DELETE ID 👉", id);
        try {
            const confirmDelete = window.confirm("Are you sure you want to delete?");
            if (!confirmDelete) return;

            const res = await fetch(`https://corpfinder-backend.onrender.com/employee/delete-by-all/${id}`, {
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

            setEmpPage(1);
            fetchAllEmployees();

        } catch (err) {
            console.log(err);
            alert("Server error ❌");
        }
    };

    const handleUpdate = async () => {
        try {
            const res = await fetch(
                `https://corpfinder-backend.onrender.com/employee/update-by-all/${editingId}`,
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

            setEditingId(null);
            fetchAllEmployees();  // refresh list

        } catch (err) {
            console.log(err);
            alert("Server error ❌");
        }
    };

    const handleDeleteCompany = async (id) => {
        try {
            const confirmDelete = window.confirm("Delete this company?");
            if (!confirmDelete) return;

            const res = await fetch(
                `https://corpfinder-backend.onrender.com/company/delete-by-all/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("adminToken")}`
                    }
                }
            );

            const data = await res.json();

            if (!res.ok) {
                alert(data.msg || "Delete failed ❌");
                return;
            }

            alert("Company deleted successfully ✅");

            setCompPage(1);
            fetchAllCompanies();

        } catch (err) {
            console.log(err);
            alert("Server error ❌");
        }
    };

    const handleEditCompany = (company) => {
        setEditingCompanyId(company._id);

        setCompanyForm({
            company_name: company.company_name || "",
            company_type: company.company_type || "",
            company_industry: company.company_industry || "",
            company_city: company.company_city || "",
            company_state: company.company_state || "",
            company_country: company.company_country || "",
            company_email: company.company_email || "",
            company_phone: company.company_phone || "",
            company_website: company.company_website || "",
            company_linkedin_url: company.company_linkedin_url || "",
            company_founded: company.company_founded || "",
            company_address: company.company_address || "",
            company_description: company.company_description || ""
        });
    };

    const handleUpdateCompany = async () => {
        try {
            const res = await fetch(
                `https://corpfinder-backend.onrender.com/company/update-by-all/${editingCompanyId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("adminToken")}`
                    },
                    body: JSON.stringify(companyForm)
                }
            );

            const data = await res.json();

            if (!res.ok) {
                alert(data.msg || "Update failed ❌");
                return;
            }

            alert("Company updated successfully ✅");

            setEditingCompanyId(null);
            fetchAllCompanies();

        } catch (err) {
            console.log(err);
            alert("Server error ❌");
        }
    };

    // 🔍 SEARCH FILTER
    const filteredEmployees = employees.filter(emp =>
        emp.name?.toLowerCase().includes(empSearch.toLowerCase()) ||
        emp.company?.toLowerCase().includes(empSearch.toLowerCase())
    );

    const filteredCompanies = companies.filter(c =>
        c.company_name?.toLowerCase().includes(compSearch.toLowerCase()) ||
        c.company_city?.toLowerCase().includes(compSearch.toLowerCase())
    );

    // 📄 PAGINATION
    const paginate = (data, page) => {
        const start = (page - 1) * recordsPerPage;
        return data.slice(start, start + recordsPerPage);
    };

    const currentEmployees = paginate(filteredEmployees, empPage);
    const currentCompanies = paginate(filteredCompanies, compPage);

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

                    <h1 className="text-lg font-semibold">View Data</h1>

                    <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-xl">
                        <div className="h-8 w-8 flex items-center justify-center rounded-full bg-blue-600 text-white text-sm">
                            A
                        </div>
                        <span>{adminName}</span>
                    </div>
                </header>

                {/* MAIN */}
                <main className="p-6 space-y-8">

                    {/* 🔥 EMPLOYEES */}
                    <div className="bg-white rounded-2xl shadow-md border">

                        {/* HEADER */}
                        <div className="p-4 border-b flex justify-between items-center">
                            <h2 className="font-semibold text-lg">Employees</h2>

                            <div className="flex items-center gap-2 border rounded-lg px-3 py-1 bg-gray-50">
                                <Search size={16} />
                                <input
                                    type="text"
                                    placeholder="Search employee..."
                                    className="outline-none bg-transparent text-sm"
                                    value={empSearch}
                                    onChange={(e) => {
                                        setEmpSearch(e.target.value);
                                        setEmpPage(1);
                                    }}
                                />
                            </div>
                        </div>

                        {/* TABLE */}
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[1000px] text-sm">
                                <thead className="bg-gray-100 sticky top-0">
                                    <tr>
                                        <th className="p-3 text-left">Name</th>
                                        <th className="p-3 text-left">Company</th>
                                        <th className="p-3 text-left">City</th>
                                        <th className="p-3 text-left">State</th>
                                        <th className="p-3 text-left">Country</th>
                                        <th className="p-3 text-left">Designation</th>
                                        <th className="p-3 text-left">Email</th>
                                        <th className="p-3 text-left">Phone</th>
                                        <th className="p-3 text-left">Industry</th>
                                        <th className="p-3 text-left">Action</th>
                                        <th className="p-3 text-left">Admin</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {currentEmployees.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="text-center p-6 text-gray-500">
                                                No employees found
                                            </td>
                                        </tr>
                                    ) : (
                                        currentEmployees.map(emp => (
                                            <tr key={emp._id} className="border-t hover:bg-gray-50">
                                                <td className="p-3">{emp.name}</td>
                                                <td className="p-3">{emp.company}</td>
                                                <td className="p-3">{emp.city}</td>
                                                <td className="p-3">{emp.state}</td>
                                                <td className="p-3">{emp.country}</td>
                                                <td className="p-3">{emp.designation}</td>
                                                <td className="p-3">{emp.email}</td>
                                                <td className="p-3">{emp.phone}</td>
                                                <td className="p-3">{emp.industry}</td>
                                                <td className="p-3 flex gap-2">

                                                    {/* UPDATE BUTTON */}
                                                    <button
                                                        className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                                                        onClick={() => handleEdit(emp)}
                                                    >
                                                        Update
                                                    </button>

                                                    {/* DELETE BUTTON */}
                                                    <button
                                                        className={`px-2 py-1 text-xs rounded text-white
            ${adminRole === "superadmin"
                                                                ? "bg-red-500 hover:bg-red-600"
                                                                : "bg-gray-400 cursor-not-allowed"
                                                            }`}
                                                        disabled={adminRole !== "superadmin"}
                                                        onClick={() => handleDelete(emp._id)}
                                                    >
                                                        Delete
                                                    </button>

                                                </td>
                                                <td className="p-3 text-blue-600 font-medium">
                                                    {emp.adminId?.username || "N/A"}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {editingId && (
                            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">

                                <div className="bg-white p-6 rounded-xl w-[500px] shadow-lg">

                                    <h2 className="text-lg font-bold mb-4">Update Employee</h2>

                                    <div className="grid grid-cols-2 gap-3">

                                        <input
                                            value={editForm.name}
                                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                            className="input-styled"
                                            placeholder="Name"
                                        />

                                        <input
                                            value={editForm.designation}
                                            onChange={(e) => setEditForm({ ...editForm, designation: e.target.value })}
                                            className="input-styled"
                                            placeholder="Designation"
                                        />

                                        <input
                                            value={editForm.company}
                                            onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                                            className="input-styled"
                                            placeholder="Company"
                                        />

                                        <input
                                            value={editForm.city}
                                            onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                                            className="input-styled"
                                            placeholder="City"
                                        />

                                        <input
                                            value={editForm.state}
                                            onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
                                            className="input-styled"
                                            placeholder="State"
                                        />

                                        <input
                                            value={editForm.country}
                                            onChange={(e) => setEditForm({ ...editForm, country: e.target.value })}
                                            className="input-styled"
                                            placeholder="Country"
                                        />

                                        <input
                                            value={editForm.email}
                                            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                            className="input-styled"
                                            placeholder="Email"
                                        />

                                        <input
                                            value={editForm.phone}
                                            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                            className="input-styled"
                                            placeholder="Phone"
                                        />

                                    </div>

                                    <div className="flex gap-2 mt-4">

                                        <button
                                            onClick={handleUpdate}
                                            className="btn-primary w-full"
                                        >
                                            Update
                                        </button>

                                        <button
                                            onClick={() => setEditingId(null)}
                                            className="w-full border rounded"
                                        >
                                            Cancel
                                        </button>

                                    </div>

                                </div>
                            </div>
                        )}

                        {/* PAGINATION */}
                        {/* 🔥 PROFESSIONAL PAGINATION */}
                        <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-4 border-t bg-gray-50">

                            {/* LEFT INFO */}
                            <p className="text-sm text-gray-600">
                                Showing {(empPage - 1) * recordsPerPage + 1} to{" "}
                                {Math.min(empPage * recordsPerPage, filteredEmployees.length)} of{" "}
                                {filteredEmployees.length} records
                            </p>

                            {/* RIGHT CONTROLS */}
                            <div className="flex items-center gap-2 flex-wrap">

                                {/* PREV */}
                                <button
                                    onClick={() => setEmpPage(prev => prev - 1)}
                                    disabled={empPage === 1}
                                    className="px-3 py-1 rounded-lg border text-sm hover:bg-gray-100 disabled:opacity-40"
                                >
                                    Prev
                                </button>

                                {/* PAGE NUMBERS */}
                                {Array.from(
                                    { length: Math.ceil(filteredEmployees.length / recordsPerPage) },
                                    (_, i) => i + 1
                                )
                                    .slice(
                                        Math.max(0, empPage - 3),
                                        Math.min(
                                            Math.ceil(filteredEmployees.length / recordsPerPage),
                                            empPage + 2
                                        )
                                    )
                                    .map(page => (
                                        <button
                                            key={page}
                                            onClick={() => setEmpPage(page)}
                                            className={`px-3 py-1 rounded-lg text-sm border transition 
                        ${empPage === page
                                                    ? "bg-blue-600 text-white border-blue-600"
                                                    : "hover:bg-gray-100"
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}

                                {/* NEXT */}
                                <button
                                    onClick={() => setEmpPage(prev => prev + 1)}
                                    disabled={empPage === Math.ceil(filteredEmployees.length / recordsPerPage)}
                                    className="px-3 py-1 rounded-lg border text-sm hover:bg-gray-100 disabled:opacity-40"
                                >
                                    Next
                                </button>

                            </div>
                        </div>

                    </div>

                    {/* 🔥 COMPANIES */}

                    <div className="bg-white rounded-2xl shadow-md border">

                        <div className="p-4 border-b flex justify-between items-center">
                            <h2 className="font-semibold text-lg">Companies</h2>

                            <div className="flex items-center gap-2 border rounded-lg px-3 py-1 bg-gray-50">
                                <Search size={16} />
                                <input
                                    type="text"
                                    placeholder="Search company..."
                                    className="outline-none bg-transparent text-sm"
                                    value={compSearch}
                                    onChange={(e) => {
                                        setCompSearch(e.target.value);
                                        setCompPage(1);
                                    }}
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[900px] text-sm">
                                <thead className="bg-gray-100 sticky top-0">
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

                                        <th className="p-3 text-left">linkedin url</th>
                                        <th className="p-3 text-left">Founded</th>
                                        <th className="p-3 text-left">Address</th>
                                        <th className="p-3 text-left">Description</th>
                                        <th className="p-3 text-left">Action</th>
                                        <th className="p-3 text-left">Admin</th>

                                    </tr>
                                </thead>

                                <tbody>
                                    {currentCompanies.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="text-center p-6 text-gray-500">
                                                No companies found
                                            </td>
                                        </tr>
                                    ) : (
                                        currentCompanies.map(c => (
                                            <tr key={c._id} className="border-t hover:bg-gray-50">
                                                <td className="p-3">{c.company_name}</td>
                                                <td className="p-3">{c.company_type}</td>
                                                <td className="p-3">{c.company_industry}</td>
                                                <td className="p-3">{c.company_city}</td>
                                                <td className="p-3">{c.company_state}</td>
                                                <td className="p-3">{c.company_country}</td>
                                                <td className="p-3">{c.company_email || "-"}</td>
                                                <td className="p-3">{c.company_phone || "-"}</td>
                                                <td className="p-3">{c.company_website || "-"}</td>
                                                <td className="p-3">{c.company_linkedin_url || "-"}</td>
                                                <td className="p-3">{c.company_founded || "-"}</td>
                                                <td className="p-3">{c.company_address || "-"}</td>
                                                <td className="p-3 text-gray-600">
                                                    {c.company_description
                                                        ? c.company_description.length > 50
                                                            ? c.company_description.substring(0, 50) + "..."
                                                            : c.company_description
                                                        : "-"}
                                                </td>

                                                <td className="p-3 flex gap-2">

                                                    <button
                                                        className="px-2 py-1 text-xs bg-blue-500 text-white rounded"
                                                        onClick={() => handleEditCompany(c)}
                                                    >
                                                        Update
                                                    </button>

                                                    <button
                                                        className={`px-2 py-1 text-xs rounded text-white
    ${adminRole === "superadmin"
                                                                ? "bg-red-500 hover:bg-red-600"
                                                                : "bg-gray-400 cursor-not-allowed"
                                                            }`}
                                                        disabled={adminRole !== "superadmin"}
                                                        onClick={() => handleDeleteCompany(c._id)}
                                                    >
                                                        Delete
                                                    </button>

                                                </td>
                                                <td className="p-3 text-green-600 font-medium">
                                                    {c.adminId?.username || "N/A"}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {editingCompanyId && (
                            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">

                                <div className="bg-white p-6 rounded-xl w-[700px] shadow-lg">

                                    <h2 className="text-lg font-bold mb-4">Update Company</h2>

                                    <div className="grid grid-cols-2 gap-3">

                                        <input
                                            value={companyForm.company_name || ""}
                                            onChange={(e) => setCompanyForm({ ...companyForm, company_name: e.target.value })}
                                            className="input-styled"
                                            placeholder="Company Name"
                                        />

                                        <input
                                            value={companyForm.company_type || ""}
                                            onChange={(e) => setCompanyForm({ ...companyForm, company_type: e.target.value })}
                                            className="input-styled"
                                            placeholder="Type"
                                        />

                                        <input
                                            value={companyForm.company_industry || ""}
                                            onChange={(e) => setCompanyForm({ ...companyForm, company_industry: e.target.value })}
                                            className="input-styled"
                                            placeholder="Industry"
                                        />

                                        <input
                                            value={companyForm.company_city || ""}
                                            onChange={(e) => setCompanyForm({ ...companyForm, company_city: e.target.value })}
                                            className="input-styled"
                                            placeholder="City"
                                        />

                                        <input
                                            value={companyForm.company_state || ""}
                                            onChange={(e) => setCompanyForm({ ...companyForm, company_state: e.target.value })}
                                            className="input-styled"
                                            placeholder="State"
                                        />

                                        <input
                                            value={companyForm.company_country || ""}
                                            onChange={(e) => setCompanyForm({ ...companyForm, company_country: e.target.value })}
                                            className="input-styled"
                                            placeholder="Country"
                                        />

                                        <input
                                            value={companyForm.company_email || ""}
                                            onChange={(e) => setCompanyForm({ ...companyForm, company_email: e.target.value })}
                                            className="input-styled"
                                            placeholder="Email"
                                        />

                                        <input
                                            value={companyForm.company_phone || ""}
                                            onChange={(e) => setCompanyForm({ ...companyForm, company_phone: e.target.value })}
                                            className="input-styled"
                                            placeholder="Phone"
                                        />

                                        <input
                                            value={companyForm.company_website || ""}
                                            onChange={(e) => setCompanyForm({ ...companyForm, company_website: e.target.value })}
                                            className="input-styled"
                                            placeholder="Website"
                                        />

                                        <input
                                            value={companyForm.company_linkedin_url || ""}
                                            onChange={(e) => setCompanyForm({ ...companyForm, company_linkedin_url: e.target.value })}
                                            className="input-styled"
                                            placeholder="LinkedIn URL"
                                        />

                                        <input
                                            value={companyForm.company_founded || ""}
                                            onChange={(e) => setCompanyForm({ ...companyForm, company_founded: e.target.value })}
                                            className="input-styled"
                                            placeholder="Founded Year"
                                        />

                                        <input
                                            value={companyForm.company_address || ""}
                                            onChange={(e) => setCompanyForm({ ...companyForm, company_address: e.target.value })}
                                            className="input-styled"
                                            placeholder="Address"
                                        />

                                        <textarea
                                            value={companyForm.company_description || ""}
                                            onChange={(e) => setCompanyForm({ ...companyForm, company_description: e.target.value })}
                                            className="input-styled col-span-2"
                                            placeholder="Description"
                                        />

                                    </div>

                                    <div className="flex gap-2 mt-4">

                                        <button
                                            onClick={handleUpdateCompany}
                                            className="btn-primary w-full"
                                        >
                                            Update
                                        </button>

                                        <button
                                            onClick={() => setEditingCompanyId(null)}
                                            className="w-full border rounded"
                                        >
                                            Cancel
                                        </button>

                                    </div>

                                </div>
                            </div>
                        )}

                        {/* 🔥 PROFESSIONAL PAGINATION - COMPANIES */}
                        <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-4 border-t bg-gray-50">

                            {/* LEFT INFO */}
                            <p className="text-sm text-gray-600">
                                Showing {(compPage - 1) * recordsPerPage + 1} to{" "}
                                {Math.min(compPage * recordsPerPage, filteredCompanies.length)} of{" "}
                                {filteredCompanies.length} records
                            </p>

                            {/* RIGHT CONTROLS */}
                            <div className="flex items-center gap-2 flex-wrap">

                                {/* PREV */}
                                <button
                                    onClick={() => setCompPage(prev => prev - 1)}
                                    disabled={compPage === 1}
                                    className="px-3 py-1 rounded-lg border text-sm hover:bg-gray-100 disabled:opacity-40"
                                >
                                    Prev
                                </button>

                                {/* PAGE NUMBERS */}
                                {Array.from(
                                    { length: Math.ceil(filteredCompanies.length / recordsPerPage) },
                                    (_, i) => i + 1
                                )
                                    .slice(
                                        Math.max(0, compPage - 3),
                                        Math.min(
                                            Math.ceil(filteredCompanies.length / recordsPerPage),
                                            compPage + 2
                                        )
                                    )
                                    .map(page => (
                                        <button
                                            key={page}
                                            onClick={() => setCompPage(page)}
                                            className={`px-3 py-1 rounded-lg text-sm border transition 
                        ${compPage === page
                                                    ? "bg-blue-600 text-white border-blue-600"
                                                    : "hover:bg-gray-100"
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}

                                {/* NEXT */}
                                <button
                                    onClick={() => setCompPage(prev => prev + 1)}
                                    disabled={compPage === Math.ceil(filteredCompanies.length / recordsPerPage)}
                                    className="px-3 py-1 rounded-lg border text-sm hover:bg-gray-100 disabled:opacity-40"
                                >
                                    Next
                                </button>

                            </div>
                        </div>

                    </div>

                </main>
            </div>
        </div>
    );
};

export default ViewData;