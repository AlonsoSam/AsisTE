import { jwtDecode } from "jwt-decode";

export const getToken = () => {
    return localStorage.getItem("token");
};

export const getUserRoles = () => {
    const token = getToken();

    if (!token) {
        return [];
    }

    try {
        const decoded = jwtDecode(token);

        const roleClaim =
            decoded[
                "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
                ];

        if (!roleClaim) {
            return [];
        }

        return Array.isArray(roleClaim)
            ? roleClaim
            : [roleClaim];
    } catch {
        return [];
    }
};

export const hasRole = (role) => {
    return getUserRoles().includes(role);
};

export const isAdministrator = () => {
    return hasRole("Administrador");
};