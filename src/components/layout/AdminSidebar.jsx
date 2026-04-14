// components/AdminSidebar.jsx
import { Link, useNavigate } from "react-router-dom";
import { Shield, Users, Building2, Table, LogOut } from "lucide-react";

const AdminSidebar = ({ sidebarOpen, setSidebarOpen }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // 🔥 clear token
        localStorage.removeItem("adminToken");

        // redirect
        navigate("/admin/login");
    };

    return (
        <>
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-foreground/20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

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
                    <Link to="/admin/dashboard" className="sidebar-link w-full">
                        <Table className="h-4 w-4" />
                        Dashboard
                    </Link>

                    <Link to="/admin/subAdmin" className="sidebar-link w-full">
                        <Building2 className="h-4 w-4" />
                        Add Admin
                    </Link>

                    <Link to="/admin/view-data" className="sidebar-link w-full">
                        <Table className="h-4 w-4" />
                        View Data
                    </Link>

                    <Link to="/admin/add-employee" className="sidebar-link w-full">
                        <Users className="h-4 w-4" />
                        Add Employee
                    </Link>

                    <Link to="/admin/add-company" className="sidebar-link w-full">
                        <Building2 className="h-4 w-4" />
                        Add Company
                    </Link>
                </nav>

                {/* 🔥 LOGOUT */}
                <div className="border-t border-border p-4">
                    <button
                        onClick={handleLogout}
                        className="sidebar-link text-destructive hover:bg-destructive/10 w-full flex items-center gap-2"
                    >
                        <LogOut className="h-4 w-4" />
                        Logout
                    </button>
                </div>
            </aside>
        </>
    );
};

export default AdminSidebar;