"use client";
import { useSession } from "next-auth/react";

export default function Testui() {
    const { data, status } = useSession();

    if (status === "loading") return <p>Loading...</p>;

    return (
        <pre className="bg-base-200 p-2 rounded text-xs">
            {JSON.stringify(data?.user, null, 2)}
        </pre>
    );
}
