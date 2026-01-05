"use client";

import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = "info", timeout = 3000) => {
        const id = crypto.randomUUID();

        setToasts((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, timeout);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            {/* Toast container */}
            <div className="toast toast-top toast-end z-50">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className={`alert alert-${t.type}`}
                    >
                        <span>{t.message}</span>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) {
        throw new Error("useToast must be used inside ToastProvider");
    }
    return ctx;
}
