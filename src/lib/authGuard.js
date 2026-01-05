import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { hasRequiredRole } from "@/lib/roles";

export async function requireAuth(requiredRole = null) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        throw new Error("UNAUTHORIZED");
    }

    if (
        requiredRole &&
        !hasRequiredRole(session.user.role, requiredRole)
    ) {
        throw new Error("FORBIDDEN");
    }

    return session.user;
}
