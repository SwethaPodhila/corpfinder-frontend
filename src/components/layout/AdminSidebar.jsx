import { Link, useNavigate, useLocation } from "react-router-dom";
import { Shield, Users, Building2, Table, LogOut } from "lucide-react";

const AdminSidebar = ({ sidebarOpen, setSidebarOpen }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
    };

    const getLinkClass = (path) => {
        return `flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium
        ${location.pathname === path
                ? "text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`;
    };

    // 🔥 reusable style
    const activeStyle = {
        background: "rgb(41, 188, 221)"
    };

    return (
        <>
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r bg-white shadow-lg transition-transform lg:translate-x-0 
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
            >

                {/* LOGO */}
                <div className="flex items-center gap-3 border-b px-6 py-5">
                    <div
                        className="flex h-9 w-9 items-center justify-center rounded-xl text-white shadow"
                        style={{
                            background: "linear-gradient(135deg, rgba(10,132,162,1), rgba(13,165,199,1))"
                        }}
                    >
                        <Shield className="h-5 w-5" />
                    </div>
                    <span className="text-lg font-bold text-gray-800">
                        Admin Panel
                    </span>
                </div>

                {/* NAV */}
                <nav className="flex-1 space-y-2 p-4">

                    <Link
                        to="/admin/dashboard"
                        className={getLinkClass("/admin/dashboard")}
                        style={location.pathname === "/admin/dashboard" ? activeStyle : {}}
                    >
                        <Table className="h-4 w-4" />
                        Dashboard
                    </Link>

                    <Link
                        to="/admin/subAdmin"
                        className={getLinkClass("/admin/subAdmin")}
                        style={location.pathname === "/admin/subAdmin" ? activeStyle : {}}
                    >
                        <Building2 className="h-4 w-4" />
                        Add Admin
                    </Link>

                    <Link
                        to="/admin/view-data"
                        className={getLinkClass("/admin/view-data")}
                        style={location.pathname === "/admin/view-data" ? activeStyle : {}}
                    >
                        <Table className="h-4 w-4" />
                        View Data
                    </Link>

                    <Link
                        to="/admin/add-employee"
                        className={getLinkClass("/admin/add-employee")}
                        style={location.pathname === "/admin/add-employee" ? activeStyle : {}}
                    >
                        <Users className="h-4 w-4" />
                        Add Employee
                    </Link>

                    <Link
                        to="/admin/add-company"
                        className={getLinkClass("/admin/add-company")}
                        style={location.pathname === "/admin/add-company" ? activeStyle : {}}
                    >
                        <Building2 className="h-4 w-4" />
                        Add Company
                    </Link>

                    <Link
                        to="/admin/add-employees"
                        className={getLinkClass("/admin/add-employee")}
                        style={location.pathname === "/admin/add-employee" ? activeStyle : {}}
                    >
                        <Users className="h-4 w-4" />
                        Add Employee
                    </Link>

                </nav>

                {/* LOGOUT */}
                <div className="border-t p-4">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-100 transition"
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