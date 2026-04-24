import React, { useEffect, useState } from "react";
import { Menu, Search } from "lucide-react";
import AdminSidebar from "../components/layout/AdminSidebar";
import { jwtDecode } from "jwt-decode";

const ViewData = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [adminName, setAdminName] = useState("");
    const [adminRole, setAdminRole] = useState("");

    const [employees, setEmployees] = useState([]);
    const [empPage, setEmpPage] = useState(1);
    const [empSearch, setEmpSearch] = useState("");

    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});

    // 🔐 Admin Info
    useEffect(() => {
        const token = localStorage.getItem("adminToken");

        if (token) {
            const decoded = jwtDecode(token);
            setAdminName(decoded.username || decoded.email);
            setAdminRole(decoded.role);
        }

        fetchEmployees();
    }, []);

    // 🔥 Fetch Employees
    const fetchEmployees = async () => {
        try {
            const res = await fetch("https://corpfinder-backend.onrender.com/employees/allEmployees", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("adminToken")}`
                }
            });

            const data = await res.json();

            console.log("GET RESPONSE:", data);

            // 👇 SAFE HANDLING
            if (Array.isArray(data)) {
                setEmployees(data);
            } else if (Array.isArray(data.employees)) {
                setEmployees(data.employees);
            } else {
                setEmployees([]);
            }

        } catch (err) {
            console.error("GET ERROR:", err);
            setEmployees([]);
        }
    };

    // 🔥 DELETE
    const handleDelete = async (id) => {
        if (!window.confirm("Delete this record?")) return;

        const res = await fetch(
            `https://corpfinder-backend.onrender.com/employee/delete/${id}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("adminToken")}`
                }
            }
        );

        const data = await res.json();

        if (!res.ok) return alert(data.msg);

        alert("Deleted ✅");
        fetchEmployees();
    };

    // 🔥 EDIT OPEN
    const handleEdit = (emp) => {
        setEditingId(emp._id);

        setEditForm({
            first_name: emp.first_name ?? "",
            last_name: emp.last_name ?? "",
            designation: emp.designation ?? "",
            city: emp.city ?? "",
            state: emp.state ?? "",
            country: emp.country ?? "",
            personal_email: emp.personal_email ?? "",
            business_email: emp.business_email ?? "",
            phone: emp.phone ?? "",
            linkedin_id: emp.linkedin_id ?? "",
            linkedin_url: emp.linkedin_url ?? "",
            description: emp.description ?? "",

            company_name: emp.company_name ?? "",
            company_industry: emp.company_industry ?? "",
            company_type: emp.company_type ?? "",
            company_email: emp.company_email ?? "",
            company_phone: emp.company_phone ?? "",

            // 🆕 IMPORTANT: initialize ALL update fields also
            company_website: emp.company_website ?? "",
            company_address: emp.company_address ?? "",
            company_city: emp.company_city ?? "",
            company_state: emp.company_state ?? "",
            company_country: emp.company_country ?? "",
            company_founded: emp.company_founded ?? "",
            company_linkedin_url: emp.company_linkedin_url ?? "",

            company_description: emp.company_description ?? ""
        });
    };

    // 🔥 UPDATE
    const handleUpdate = async () => {
        const cleanPayload = {
            first_name: editForm.first_name,
            last_name: editForm.last_name,
            designation: editForm.designation,
            city: editForm.city,
            state: editForm.state,
            country: editForm.country,
            linkedin_id: editForm.linkedin_id,
            linkedin_url: editForm.linkedin_url,
            description: editForm.description,
            personal_email: editForm.personal_email,
            business_email: editForm.business_email,
            phone: editForm.phone,

            company_name: editForm.company_name,
            company_industry: editForm.company_industry,
            company_type: editForm.company_type,
            company_email: editForm.company_email,
            company_phone: editForm.company_phone,
            company_website: editForm.company_website,
            company_address: editForm.company_address,
            company_city: editForm.company_city,
            company_state: editForm.company_state,
            company_country: editForm.company_country,
            company_founded: editForm.company_founded,
            company_linkedin_url: editForm.company_linkedin_url,
            company_description: editForm.company_description
        };

        const res = await fetch(
            `https://corpfinder-backend.onrender.com/employees/update/${editingId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("adminToken")}`
                },
                body: JSON.stringify(cleanPayload)
            }
        );

        const data = await res.json();

        if (!res.ok) return alert(data.msg);

        alert("Updated ✅");
        setEditingId(null);
        fetchEmployees();
    };

    // 🔍 SEARCH
    const filtered = employees.filter(emp =>
        `${emp.first_name} ${emp.last_name}`.toLowerCase().includes(empSearch.toLowerCase()) ||
        emp.company_name?.toLowerCase().includes(empSearch.toLowerCase()) ||
        emp.personal_email?.toLowerCase().includes(empSearch.toLowerCase())
    );

    // 📄 PAGINATION
    // 📄 PAGINATION SETTINGS
    const recordsPerPage = 10;

    // 🔍 filtered data
    const filteredEmployees = employees.filter(emp =>
        `${emp.first_name} ${emp.last_name}`.toLowerCase().includes(empSearch.toLowerCase()) ||
        emp.company_name?.toLowerCase().includes(empSearch.toLowerCase()) ||
        emp.personal_email?.toLowerCase().includes(empSearch.toLowerCase())
    );

    // 📊 total pages
    const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / recordsPerPage));

    // 🧠 safe page (prevents empty screen bug)
    const safePage = Math.min(empPage, totalPages);

    // 📍 slice data
    const startIndex = (safePage - 1) * recordsPerPage;

    const currentEmployees = filteredEmployees.slice(
        startIndex,
        startIndex + recordsPerPage
    );

    // 🔁 auto fix invalid page when search changes
    useEffect(() => {
        setEmpPage(1);
    }, [empSearch]);

    useEffect(() => {
        if (empPage > totalPages) {
            setEmpPage(totalPages);
        }
    }, [totalPages]);

    return (
        <div className="flex min-h-screen bg-gray-50">

            <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            <div className="flex flex-1 flex-col lg:ml-64">

                {/* HEADER */}
                <header className="flex justify-between bg-white p-4 border-b">
                    <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
                        <Menu />
                    </button>

                    <h1 className="font-semibold text-lg">View Data</h1>

                    <span>{adminName}</span>
                </header>

                {/* MAIN */}
                <main className="p-6">

                    <div className="bg-white rounded-xl shadow">

                        {/* SEARCH */}
                        <div className="p-4 flex justify-between border-b">
                            <h2 className="font-semibold">Employees</h2>

                            <div className="flex items-center gap-2 border px-3 py-1 rounded">
                                <Search size={16} />
                                <input
                                    placeholder="Search..."
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
                            <table className="w-full text-sm">

                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="p-3 text-left">Name</th>
                                        <th className="p-3">Designation</th>
                                        <th className="p-3">Company</th>
                                        <th className="p-3">Type</th>
                                        <th className="p-3">Industry</th>
                                        <th className="p-3">City</th>
                                        <th className="p-3">Country</th>
                                        <th className="p-3">Email</th>
                                        <th className="p-3">Phone</th>
                                        <th className="p-3">Company Email</th>
                                        <th className="p-3">Company Phone</th>
                                        <th className="p-3">Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {currentEmployees.map(emp => (
                                        <tr key={emp._id} className="border-t">

                                            <td className="p-3">
                                                {emp.first_name} {emp.last_name || ""}
                                            </td>

                                            <td className="p-3">{emp.designation}</td>

                                            <td className="p-3">{emp.company_name}</td>

                                            <td className="p-3">{emp.company_type}</td>

                                            <td className="p-3">{emp.company_industry}</td>

                                            <td className="p-3">{emp.city}</td>

                                            <td className="p-3">{emp.country}</td>

                                            <td className="p-3">{emp.personal_email}</td>

                                            <td className="p-3">{emp.phone}</td>

                                            <td className="p-3">{emp.company_email}</td>

                                            <td className="p-3">{emp.company_phone}</td>

                                            <td className="p-3 flex gap-2">

                                                <button
                                                    className="bg-blue-500 text-white px-2 py-1 rounded"
                                                    onClick={() => handleEdit(emp)}
                                                >
                                                    Update
                                                </button>

                                                <button
                                                    className={`px-2 py-1 rounded text-white 
                    ${adminRole === "superadmin"
                                                            ? "bg-red-500"
                                                            : "bg-gray-400"
                                                        }`}
                                                    disabled={adminRole !== "superadmin"}
                                                    onClick={() => handleDelete(emp._id)}
                                                >
                                                    Delete
                                                </button>

                                            </td>

                                        </tr>
                                    ))}
                                </tbody>

                            </table>
                        </div>

                        {/* PAGINATION */}
                        <div className="flex justify-center items-center gap-2 p-4 border-t">

                            {/* Prev */}
                            <button
                                disabled={safePage === 1}
                                onClick={() => setEmpPage(safePage - 1)}
                                className="px-3 py-1 border rounded disabled:opacity-50"
                            >
                                Prev
                            </button>

                            {/* Page Numbers (LIMITED VIEW - CLEAN UI) */}
                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                                .slice(Math.max(0, safePage - 3), safePage + 2)
                                .map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => setEmpPage(page)}
                                        className={`px-3 py-1 border rounded ${safePage === page ? "bg-blue-500 text-white" : ""
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}

                            {/* Next */}
                            <button
                                disabled={safePage === totalPages}
                                onClick={() => setEmpPage(safePage + 1)}
                                className="px-3 py-1 border rounded disabled:opacity-50"
                            >
                                Next
                            </button>

                        </div>

                    </div>

                    {/* 🔥 UPDATE MODAL */}
                    {editingId && (
                        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">

                            <div className="bg-white p-6 rounded-xl w-[600px]">

                                <h2 className="font-bold mb-4">Update</h2>

                                <div className="grid grid-cols-2 gap-3">

                                    {/* 👤 Employee */}
                                    <input placeholder="First Name"
                                        value={editForm.first_name || ""}
                                        onChange={e => setEditForm({ ...editForm, first_name: e.target.value })}
                                    />

                                    <input placeholder="Last Name"
                                        value={editForm.last_name || ""}
                                        onChange={e => setEditForm({ ...editForm, last_name: e.target.value })}
                                    />

                                    <input placeholder="Designation"
                                        value={editForm.designation || ""}
                                        onChange={e => setEditForm({ ...editForm, designation: e.target.value })}
                                    />

                                    <input placeholder="Personal Email"
                                        value={editForm.personal_email || ""}
                                        onChange={e => setEditForm({ ...editForm, personal_email: e.target.value })}
                                    />

                                    <input placeholder="Business Email"
                                        value={editForm.business_email || ""}
                                        onChange={e => setEditForm({ ...editForm, business_email: e.target.value })}
                                    />

                                    <input placeholder="Phone"
                                        value={editForm.phone || ""}
                                        onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                                    />

                                    <input placeholder="City"
                                        value={editForm.city || ""}
                                        onChange={e => setEditForm({ ...editForm, city: e.target.value })}
                                    />

                                    <input placeholder="State"
                                        value={editForm.state || ""}
                                        onChange={e => setEditForm({ ...editForm, state: e.target.value })}
                                    />

                                    <input placeholder="Country"
                                        value={editForm.country || ""}
                                        onChange={e => setEditForm({ ...editForm, country: e.target.value })}
                                    />

                                    <input placeholder="LinkedIn ID"
                                        value={editForm.linkedin_id || ""}
                                        onChange={e => setEditForm({ ...editForm, linkedin_id: e.target.value })}
                                    />

                                    <input placeholder="LinkedIn URL"
                                        value={editForm.linkedin_url || ""}
                                        onChange={e => setEditForm({ ...editForm, linkedin_url: e.target.value })}
                                    />

                                    <textarea
                                        placeholder="Description"
                                        value={editForm.description || ""}
                                        onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                                        className="col-span-2"
                                    />

                                    {/* 🏢 Company */}
                                    <input placeholder="Company Name"
                                        value={editForm.company_name || ""}
                                        onChange={e => setEditForm({ ...editForm, company_name: e.target.value })}
                                    />

                                    <input placeholder="Company Type"
                                        value={editForm.company_type || ""}
                                        onChange={e => setEditForm({ ...editForm, company_type: e.target.value })}
                                    />

                                    <input placeholder="Industry"
                                        value={editForm.company_industry || ""}
                                        onChange={e => setEditForm({ ...editForm, company_industry: e.target.value })}
                                    />

                                    <input placeholder="Company Email"
                                        value={editForm.company_email || ""}
                                        onChange={e => setEditForm({ ...editForm, company_email: e.target.value })}
                                    />

                                    <input placeholder="Company Phone"
                                        value={editForm.company_phone || ""}
                                        onChange={e => setEditForm({ ...editForm, company_phone: e.target.value })}
                                    />

                                    <input placeholder="Website"
                                        value={editForm.company_website || ""}
                                        onChange={e => setEditForm({ ...editForm, company_website: e.target.value })}
                                    />

                                    <input placeholder="Address"
                                        value={editForm.company_address || ""}
                                        onChange={e => setEditForm({ ...editForm, company_address: e.target.value })}
                                    />

                                    <input placeholder="Company City"
                                        value={editForm.company_city || ""}
                                        onChange={e => setEditForm({ ...editForm, company_city: e.target.value })}
                                    />

                                    <input placeholder="Company State"
                                        value={editForm.company_state || ""}
                                        onChange={e => setEditForm({ ...editForm, company_state: e.target.value })}
                                    />

                                    <input placeholder="Company Country"
                                        value={editForm.company_country || ""}
                                        onChange={e => setEditForm({ ...editForm, company_country: e.target.value })}
                                    />

                                    <input placeholder="LinkedIn URL"
                                        value={editForm.company_linkedin_url || ""}
                                        onChange={e => setEditForm({ ...editForm, company_linkedin_url: e.target.value })}
                                    />

                                    <input placeholder="Founded"
                                        value={editForm.company_founded || ""}
                                        onChange={e => setEditForm({ ...editForm, company_founded: e.target.value })}
                                    />

                                    <textarea
                                        placeholder="Company Description"
                                        value={editForm.company_description || ""}
                                        onChange={e => setEditForm({ ...editForm, company_description: e.target.value })}
                                        className="col-span-2"
                                    />

                                </div>

                                <div className="flex gap-2 mt-4">
                                    <button onClick={handleUpdate} className="btn-primary w-full">
                                        Update
                                    </button>

                                    <button onClick={() => setEditingId(null)} className="w-full border">
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

export default ViewData;