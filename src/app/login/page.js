"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);

        const res = await signIn("credentials", {
            email: formData.get("email"),
            password: formData.get("password"),
            redirect: false,
        });

        setLoading(false);

        if (!res.error) {
            router.push("/");
        } else {
            alert(res.error);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="card w-96 bg-base-100 shadow-xl">
                <form onSubmit={handleSubmit} className="card-body">
                    <h2 className="card-title">Login</h2>

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
                        placeholder="Password"
                        className="input input-bordered"
                        required
                    />

                    <button className="btn btn-primary" disabled={loading}>
                        Login
                    </button>

                    <div className="divider">OR</div>

                    <button
                        type="button"
                        className="btn btn-outline"
                        onClick={() => signIn("google")}
                    >
                        Continue with Google
                    </button>
                    <p className="text-sm text-center opacity-70 mt-2">
                        Don’t have an account?{" "}
                        <a href="/register" className="link">
                            Register
                        </a>
                    </p>
                </form>
            </div>
        </div>
    );
}
