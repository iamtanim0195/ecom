"use client";

import { useSession } from "next-auth/react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function AuthGuard({ children }) {
    const { status } = useSession();

    if (status === "loading") {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return children;
}
