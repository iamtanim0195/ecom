"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
    const { status } = useSession();
    const [cart, setCart] = useState(null);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(false);

    const refreshCart = useCallback(async () => {
        if (status !== "authenticated") {
            setCart(null);
            setSummary(null);
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/cart");
            const data = await res.json();
            if (res.ok) {
                setCart(data.cart);
                setSummary(data.summary);
            }
        } finally {
            setLoading(false);
        }
    }, [status]);

    useEffect(() => {
        refreshCart();
    }, [refreshCart]);

    return (
        <CartContext.Provider
            value={{
                cart,
                summary,
                loading,
                refreshCart,
                setCart,
                setSummary,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) {
        throw new Error("useCart must be used inside CartProvider");
    }
    return ctx;
}
