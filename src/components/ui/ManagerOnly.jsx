"use client";
import { useSession } from "next-auth/react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function ManagerOnly({ children }) {
    const { data, status } = useSession();

    if (status === "loading") {
        return <LoadingSpinner />;
    }

    if (!data || !["MANAGER", "ADMIN"].includes(data.user.role)) {
        return null;
    }

    return children;
}
