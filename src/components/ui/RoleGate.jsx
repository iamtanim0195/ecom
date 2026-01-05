"use client";
import { useSession } from "next-auth/react";

export default function RoleGate({ role, children }) {
    const { data } = useSession();

    if (!data || data.user.role !== role) return null;
    return children;
}
