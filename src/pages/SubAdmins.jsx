import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import AdminSidebar from "../components/layout/AdminSidebar";

const AdminManagement = () => {
    const [admins, setAdmins] = useState([]);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [editId, setEditId] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // 🔄 FETCH ADMINS
    const fetchAdmins = async () => {
        try {
            const res = await fetch("http://localhost:5000/admin");
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

        try {
            let bodyData = {
                username
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
            const res = await fetch(`http://localhost:5000/admin/${id}`, {
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
                        <span className="text-sm font-medium">Admin</span>
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

                            <button className="btn-primary">
                                {editId ? "Update" : "Create"}
                            </button>
                        </form>
                    </div>

                    {/* TABLE */}
                    <div className="rounded-2xl border bg-card overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b bg-muted/50">
                                    <th className="px-4 py-3">#</th>
                                    <th className="px-4 py-3">Username</th>
                                    <th className="px-4 py-3">Role</th>
                                    <th className="px-4 py-3">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {admins.map((admin, index) => (
                                    <tr key={admin._id} className="border-b hover:bg-muted/30">

                                        <td className="px-4 py-3">{index + 1}</td>

                                        <td className="px-4 py-3">
                                            {admin.username}
                                        </td>

                                        <td className="px-4 py-3">
                                            {admin.role}
                                        </td>

                                        <td className="px-4 py-3">

                                            <button
                                                onClick={() => handleEdit(admin)}
                                                className="text-blue-500"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() => handleDelete(admin._id)}
                                                className="text-red-500 ml-3"
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