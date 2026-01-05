"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useCart } from "@/components/cart/CartProvider";
import LogoutButton from "@/components/auth/LogoutButton";

export default function Navbar() {
    const { data } = useSession();
    const { summary } = useCart();

    return (
        <div className="navbar bg-base-100 shadow">
            <div className="flex-1">
                <Link href="/" className="btn btn-ghost text-xl">
                    Ecom
                </Link>
            </div>

            <div className="flex-none gap-2">
                <Link href="/shop" className="btn btn-ghost btn-sm">
                    Shop
                </Link>

                {data && (
                    <Link href="/cart" className="btn btn-ghost btn-sm">
                        Cart
                        {summary?.totalItems > 0 && (
                            <span className="badge badge-primary ml-1">
                                {summary.totalItems}
                            </span>
                        )}
                    </Link>
                )}

                {data ? (
                    <LogoutButton />
                ) : (
                    <Link href="/login" className="btn btn-primary btn-sm">
                        Login
                    </Link>
                )}
            </div>
        </div>
    );
}
