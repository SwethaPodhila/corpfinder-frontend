import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Building2, Shield, Upload, PlusCircle, Users, Table, LogOut, Menu } from "lucide-react";
import { companies, people } from "../data/dummyData";

const AdminDashboard = () => {
    const [tab, setTab] = useState("data");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [companyForm, setCompanyForm] = useState({
        name: "",
        industry: "",
        location: "",
        employees: "",
    });

    const [employeeForm, setEmployeeForm] = useState({
        name: "",
        role: "",
        company: "",
        email: "",
    });

    const tabs = [
        { id: "data", icon: Table, label: "View Data" },
        { id: "upload", icon: Upload, label: "Upload Excel" },
        { id: "company", icon: Building2, label: "Add Company" },
        { id: "employee", icon: Users, label: "Add Employee" },
    ];

    return (
        <div className="flex min-h-screen bg-background">
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-foreground/20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-card transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="flex items-center gap-2 border-b border-border px-6 py-5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                        <Shield className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <span className="font-heading font-bold text-foreground">
                        Admin Panel
                    </span>
                </div>

                <nav className="flex-1 space-y-1 p-4">
                    {tabs.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => {
                                setTab(t.id);
                                setSidebarOpen(false);
                            }}
                            className={`sidebar-link w-full ${tab === t.id ? "active bg-accent text-accent-foreground" : ""
                                }`}
                        >
                            <t.icon className="h-4 w-4" />
                            {t.label}
                        </button>
                    ))}
                </nav>

                <div className="border-t border-border p-4">
                    <Link
                        to="/admin/login"
                        className="sidebar-link text-destructive hover:bg-destructive/10"
                    >
                        <LogOut className="h-4 w-4" />
                        Logout
                    </Link>
                </div>
            </aside>

            {/* Main */}
            <div className="flex flex-1 flex-col lg:ml-64">
                <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-card/80 backdrop-blur-xl px-6 py-4">
                    <button
                        className="lg:hidden text-foreground"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu className="h-5 w-5" />
                    </button>

                    <h1 className="font-heading text-lg font-semibold text-foreground">
                        Admin Dashboard
                    </h1>

                    <div className="flex items-center gap-2 rounded-xl bg-muted px-3 py-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                            A
                        </div>
                        <span className="text-sm font-medium text-foreground">Admin</span>
                    </div>
                </header>

                <main className="flex-1 p-6">
                    {/* DATA TAB */}
                    {tab === "data" && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <h2 className="font-heading text-xl font-bold text-foreground mb-4">
                                Companies
                            </h2>

                            <div className="overflow-x-auto rounded-2xl border border-border bg-card">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-border bg-muted/50">
                                            {["Name", "Industry", "Location", "Employees"].map(
                                                (h) => (
                                                    <th
                                                        key={h}
                                                        className="px-4 py-3 text-left font-semibold text-foreground"
                                                    >
                                                        {h}
                                                    </th>
                                                )
                                            )}
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {companies.map((c) => (
                                            <tr
                                                key={c.id}
                                                className="border-b border-border hover:bg-muted/30"
                                            >
                                                <td className="px-4 py-3 font-medium text-foreground">
                                                    {c.name}
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">
                                                    {c.industry}
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">
                                                    {c.location}
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">
                                                    {c.employees}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <h2 className="font-heading text-xl font-bold text-foreground mt-8 mb-4">
                                Employees
                            </h2>

                            <div className="overflow-x-auto rounded-2xl border border-border bg-card">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-border bg-muted/50">
                                            {["Name", "Role", "Company", "Email"].map((h) => (
                                                <th
                                                    key={h}
                                                    className="px-4 py-3 text-left font-semibold text-foreground"
                                                >
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {people.map((p) => (
                                            <tr
                                                key={p.id}
                                                className="border-b border-border hover:bg-muted/30"
                                            >
                                                <td className="px-4 py-3 font-medium text-foreground">
                                                    {p.name}
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">
                                                    {p.role}
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">
                                                    {p.company}
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">
                                                    {p.email}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}

                    {/* UPLOAD TAB */}
                    {tab === "upload" && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <h2 className="text-xl font-bold mb-4">Upload Excel File</h2>
                            <div className="border-2 border-dashed p-10 text-center">
                                <Upload className="mx-auto mb-4" />
                                <p>Upload your file</p>
                            </div>
                        </motion.div>
                    )}

                    {/* COMPANY FORM */}
                    {tab === "company" && (
                        <form className="space-y-4">
                            <input
                                placeholder="Company Name"
                                value={companyForm.name}
                                onChange={(e) =>
                                    setCompanyForm({ ...companyForm, name: e.target.value })
                                }
                            />
                        </form>
                    )}

                    {/* EMPLOYEE FORM */}
                    {tab === "employee" && (
                        <form className="space-y-4">
                            <input
                                placeholder="Employee Name"
                                value={employeeForm.name}
                                onChange={(e) =>
                                    setEmployeeForm({ ...employeeForm, name: e.target.value })
                                }
                            />
                        </form>
                    )}
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;