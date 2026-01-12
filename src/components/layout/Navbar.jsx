"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useCart } from "@/components/cart/CartProvider";
import Logo from "../ui/Logo";
import LogoutButton from "../auth/LogoutButton";
import Image from "next/image";

export default function Navbar() {
    const { data: session } = useSession();
    const { cart } = useCart();

    return (
        <header className="sticky top-0 z-50 bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-3 flex justify-between items-center">
                {/* LOGO */}
                <Image src="/images/logo.png" alt="Logo" width={160} height={60} />

                {/* NAVIGATION LINKS */}
                <nav className="flex gap-6">
                    <Link href="/" className="text-lg text-gray-800 hover:text-blue-600">
                        Home
                    </Link>
                    <Link
                        href="/shop"
                        className="text-lg text-gray-800 hover:text-blue-600"
                    >
                        Shop
                    </Link>
                    {session?.user?.role === "ADMIN" && (
                        <Link
                            href="/dashboard"
                            className="text-lg text-gray-800 hover:text-blue-600"
                        >
                            Dashboard
                        </Link>
                    )}
                </nav>

                {/* USER MENU */}
                <div className="flex items-center gap-4">
                    {session ? (
                        <div className="relative">
                            <button className="text-lg text-gray-800 hover:text-blue-600">
                                {session.user.name || "Account"}
                            </button>
                            <div className="absolute top-8 right-0 mt-2 bg-white shadow-lg rounded-lg p-4 w-48">
                                <Link
                                    href="/profile"
                                    className="block text-gray-700 hover:text-blue-600"
                                >
                                    Profile
                                </Link>
                                <LogoutButton />
                            </div>
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            className="text-lg text-gray-800 hover:text-blue-600"
                        >
                            Login
                        </Link>
                    )}

                    {/* CART */}
                    <Link href="/cart" className="relative">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="h-6 w-6 text-gray-800 hover:text-blue-600"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M3 3h18l-1 12H4L3 3z"
                            />
                        </svg>
                        {/* Cart Badge */}
                        {cart?.items?.length > 0 && (
                            <span className="absolute top-0 right-0 block h-5 w-5 bg-red-600 text-white text-xs rounded-full text-center">
                                {cart.items.length}
                            </span>
                        )}
                    </Link>
                </div>
            </div>
        </header>
    );
}
