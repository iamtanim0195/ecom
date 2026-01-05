"use client";

import { signOut, useSession } from "next-auth/react";

export default function LogoutButton({
    className = "btn btn-error btn-sm",
    callbackUrl = "/",
}) {
    const { status } = useSession();

    if (status === "loading") {
        return (
            <button className={`${className} btn-disabled`}>
                Logging out...
            </button>
        );
    }

    return (
        <button
            className={className}
            onClick={() => signOut({ callbackUrl })}
        >
            Logout
        </button>
    );
}
