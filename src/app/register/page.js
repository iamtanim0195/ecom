"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);

        const form = new FormData(e.currentTarget);

        const payload = {
            name: form.get("name"),
            email: form.get("email"),
            password: form.get("password"),
        };

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data?.message || "Registration failed");
                return;
            }

            // Success → go to login
            router.push("/login");
        } catch (err) {
            setError("Network error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="card w-96 bg-base-100 shadow-xl">
                <form onSubmit={handleSubmit} className="card-body gap-3">
                    <h2 className="card-title">Create Account</h2>

                    {error && (
                        <div className="alert alert-error py-2">
                            <span>{error}</span>
                        </div>
                    )}

                    <input
                        name="name"
                        type="text"
                        placeholder="Full name"
                        className="input input-bordered"
                    />

                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        className="input input-bordered"
                        required
                    />

                    <input
                        name="password"
                        type="password"
                        placeholder="Password (min 6 chars)"
                        className="input input-bordered"
                        required
                        minLength={6}
                    />

                    <button className="btn btn-primary" disabled={loading}>
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <LoadingSpinner size="sm" /> Creating...
                            </span>
                        ) : (
                            "Register"
                        )}
                    </button>

                    <p className="text-sm text-center opacity-70">
                        Already have an account?{" "}
                        <a href="/login" className="link">
                            Login
                        </a>
                    </p>
                </form>
            </div>
        </div>
    );
}
