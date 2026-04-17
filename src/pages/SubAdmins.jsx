import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import AdminSidebar from "../components/layout/AdminSidebar";
import { jwtDecode } from "jwt-decode";

const AdminManagement = () => {
    const [admins, setAdmins] = useState([]);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [editId, setEditId] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [adminName, setAdminName] = useState(null);
    const [role, setRole] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("adminToken");

        if (token) {
            try {
                const decoded = jwtDecode(token);
                console.log(decoded);

                setAdminName(decoded.username || decoded.email || "Admin");
            } catch (err) {
                console.log("Token decode error", err);
            }
        }
    }, []);

    // 🔄 FETCH ADMINS
    const fetchAdmins = async () => {
        try {
            const res = await fetch("https://corpfinder-backend.onrender.com/admin");
            const data = await res.json();
            setAdmins(data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    // ➕ CREATE / ✏️ UPDATE
    const handleSubmit = async (e) => {
        e.preventDefault();

        // 🔒 VALIDATIONS
        if (!username || username.trim().length < 3) {
            alert("Username must be at least 3 characters");
            return;
        }

        if (!editId && (!password || password.length < 3)) {
            alert("Password must be at least 3 characters");
            return;
        }

        if (!role) {
            alert("Please select role");
            return;
        }

        try {
            let bodyData = {
                username: username.trim(),
                role
            };

            // 🔥 password unte maatrame send
            if (password) {
                bodyData.password = password;
            }

            if (editId) {
                // UPDATE
                const res = await fetch(`http://localhost:5000/admin/${editId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(bodyData)
                });

                const data = await res.json();

                if (!res.ok) {
                    alert(data.msg);
                    return;
                }

                alert("Admin updated successfully");
            } else {
                // CREATE
                const res = await fetch("http://localhost:5000/admin/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(bodyData)
                });

                const data = await res.json();

                if (!res.ok) {
                    alert(data.msg);
                    return;
                }

                alert("Admin created successfully");
            }

            // RESET
            setUsername("");
            setPassword("");
            setRole(""); // 🔥 reset role also
            setEditId(null);
            fetchAdmins();

        } catch (err) {
            console.log(err);
            alert("Something went wrong");
        }
    };

    // ❌ DELETE
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this admin?");

        if (!confirmDelete) return;

        try {
            const res = await fetch(`https://corpfinder-backend.onrender.com/admin/${id}`, {
                method: "DELETE"
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.msg);
                return;
            }

            alert("Admin deleted successfully");
            fetchAdmins();

        } catch (err) {
            console.log(err);
            alert("Delete failed");
        }
    };

    // ✏️ EDIT LOAD
    const handleEdit = (admin) => {
        setUsername(admin.username);
        setPassword(""); // important
        setEditId(admin._id);
    };

    return (
        <div className="flex min-h-screen bg-background">

            {/* SIDEBAR */}
            <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            {/* MAIN */}
            <div className="flex flex-1 flex-col lg:ml-64">

                {/* HEADER (UNCHANGED DESIGN) */}
                <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-card/80 backdrop-blur-xl px-6 py-4">
                    <button
                        className="lg:hidden"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu className="h-5 w-5" />
                    </button>

                    <h1 className="font-heading text-lg font-semibold">
                        Admin Management
                    </h1>

                    <div className="flex items-center gap-2 rounded-xl bg-muted px-3 py-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                            A
                        </div>
                        <span className="text-sm font-medium">{adminName}</span>
                    </div>
                </header>

                {/* CONTENT */}
                <main className="flex-1 p-6">

                    {/* FORM */}
                    <div className="mb-6 rounded-xl border bg-card p-4">
                        <h2 className="font-bold mb-3">
                            {editId ? "Update Admin" : "Create Admin"}
                        </h2>

                        <form onSubmit={handleSubmit} className="flex gap-3 flex-wrap">

                            <input
                                type="text"
                                placeholder="Username or Email"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="input-styled"
                                required
                            />

                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-styled"
                                required={!editId}
                            />

                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="input-styled"
                                required
                            >
                                <option value="">Select Role</option>
                                <option value="subadmin">Sub Admin</option>
                                <option value="superadmin">Super Admin</option>
                            </select>

                            <button className="btn-primary">
                                {editId ? "Update" : "Create"}
                            </button>
                        </form>
                    </div>

                    {/* TABLE */}
                    <div className="rounded-2xl border border-border bg-card overflow-x-auto shadow-sm">

                        <table className="w-full text-sm text-foreground">

                            {/* HEADER */}
                            <thead className="bg-muted text-left text-xs uppercase tracking-wider text-gray-600">
                                <tr>
                                    <th className="px-5 py-4">#</th>
                                    <th className="px-5 py-4">Username</th>
                                    <th className="px-5 py-4">Role</th>
                                    <th className="px-5 py-4">Actions</th>
                                </tr>
                            </thead>

                            {/* BODY */}
                            <tbody className="divide-y divide-border">
                                {admins.map((admin, index) => (
                                    <tr
                                        key={admin._id}
                                        className="hover:bg-muted/40 transition"
                                    >

                                        <td className="px-5 py-4 font-medium text-gray-700">
                                            {index + 1}
                                        </td>

                                        <td className="px-5 py-4 font-semibold text-gray-900">
                                            {admin.username}
                                        </td>

                                        <td className="px-5 py-4">
                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                                {admin.role}
                                            </span>
                                        </td>

                                        {/* ACTIONS */}
                                        <td className="px-5 py-4 flex items-center gap-3">

                                            <button
                                                onClick={() => handleEdit(admin)}
                                                className="px-3 py-1 text-xs font-medium rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() => handleDelete(admin._id)}
                                                className="px-3 py-1 text-xs font-medium rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                                            >
                                                Delete
                                            </button>

                                        </td>

                                    </tr>
                                ))}
                            </tbody>

                        </table>

                    </div>

                </main>
            </div>
        </div>
    );
};

export default AdminManagement;
