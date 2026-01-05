import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
    const { pathname } = req.nextUrl;

    // Public routes
    if (
        pathname.startsWith("/login") ||
        pathname.startsWith("/api/auth") ||
        pathname.startsWith("/_next") ||
        pathname.startsWith("/favicon.ico")
    ) {
        return NextResponse.next();
    }

    // Protect dashboard routes
    if (pathname.startsWith("/dashboard")) {
        const token = await getToken({
            req,
            secret: process.env.NEXTAUTH_SECRET,
        });

        if (!token) {
            const loginUrl = new URL("/login", req.url);
            loginUrl.searchParams.set("callbackUrl", pathname);
            return NextResponse.redirect(loginUrl);
        }

        // Role-based routing
        if (
            pathname.startsWith("/dashboard/admin") &&
            token.role !== "ADMIN"
        ) {
            return NextResponse.redirect(new URL("/unauthorized", req.url));
        }

        if (
            pathname.startsWith("/dashboard/manager") &&
            !["MANAGER", "ADMIN"].includes(token.role)
        ) {
            return NextResponse.redirect(new URL("/unauthorized", req.url));
        }
    }

    return NextResponse.next();
}

// Matcher (VERY IMPORTANT)
export const config = {
    matcher: ["/dashboard/:path*"],
};
