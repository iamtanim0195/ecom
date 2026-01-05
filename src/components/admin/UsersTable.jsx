"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/ToastProvider";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function UsersTable() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    async function loadUsers() {
        try {
            const res = await fetch("/api/admin/users");
            const data = await res.json();
            if (!res.ok) {
                showToast(data.message || "Failed to load users", "error");
                return;
            }
            setUsers(data.users);
        } catch {
            showToast("Network error", "error");
        } finally {
            setLoading(false);
        }
    }

    async function updateUser(userId, update) {
        try {
            const res = await fetch("/api/admin/users", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, ...update }),
            });

            const data = await res.json();
            if (!res.ok) {
                showToast(data.message || "Update failed", "error");
                return;
            }

            showToast("User updated", "success");
            loadUsers();
        } catch {
            showToast("Network error", "error");
        }
    }

    useEffect(() => {
        loadUsers();
    }, []);

    if (loading) {
        return <LoadingSpinner center />;
    }

    return (
        <div className="overflow-x-auto bg-base-100 shadow rounded">
            <table className="table">
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((u) => (
                        <tr key={u._id}>
                            <td>{u.email}</td>
                            <td>{u.role}</td>
                            <td>
                                {u.isActive ? (
                                    <span className="badge badge-success">Active</span>
                                ) : (
                                    <span className="badge badge-error">Disabled</span>
                                )}
                            </td>
                            <td className="flex gap-2">
                                {u.role === "USER" && (
                                    <button
                                        className="btn btn-xs"
                                        onClick={() =>
                                            updateUser(u._id, { role: "MANAGER" })
                                        }
                                    >
                                        Make Manager
                                    </button>
                                )}

                                {u.role === "MANAGER" && (
                                    <button
                                        className="btn btn-xs"
                                        onClick={() =>
                                            updateUser(u._id, { role: "USER" })
                                        }
                                    >
                                        Remove Manager
                                    </button>
                                )}

                                <button
                                    className="btn btn-xs btn-outline"
                                    onClick={() =>
                                        updateUser(u._id, { isActive: !u.isActive })
                                    }
                                >
                                    {u.isActive ? "Disable" : "Enable"}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
