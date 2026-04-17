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

    const recordsPerPage = 10;

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

    // 🔍 SEARCH FILTER
    const filteredEmployees = employees.filter(emp =>
        emp.name?.toLowerCase().includes(empSearch.toLowerCase()) ||
        emp.company?.toLowerCase().includes(empSearch.toLowerCase())
    );

    const filteredCompanies = companies.filter(c =>
        c.name?.toLowerCase().includes(compSearch.toLowerCase()) ||
        c.city?.toLowerCase().includes(compSearch.toLowerCase())
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
                                                <td className="p-3 text-blue-600 font-medium">
                                                    {emp.adminId?.username || "N/A"}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

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
                                        <th className="p-3 text-left">City</th>
                                        <th className="p-3 text-left">State</th>
                                        <th className="p-3 text-left">Country</th>
                                        <th className="p-3 text-left">Description</th>
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
                                                <td className="p-3">{c.name}</td>
                                                <td className="p-3">{c.city}</td>
                                                <td className="p-3">{c.state}</td>
                                                <td className="p-3">{c.country}</td>
                                                <td className="p-3 text-gray-600">
                                                    {c.description
                                                        ? c.description.length > 50
                                                            ? c.description.substring(0, 50) + "..."
                                                            : c.description
                                                        : "-"}
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
