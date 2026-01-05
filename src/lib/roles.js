export const ROLES = {
    USER: "USER",
    MANAGER: "MANAGER",
    ADMIN: "ADMIN",
};

// Hierarchy: higher index = more power
export const ROLE_HIERARCHY = {
    USER: 1,
    MANAGER: 2,
    ADMIN: 3,
};

export function hasRequiredRole(userRole, requiredRole) {
    if (!userRole) return false;
    return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}
