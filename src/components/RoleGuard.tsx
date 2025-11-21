import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface RoleGuardProps {
    children: React.ReactNode;
    requiredRole?: 'admin' | 'editor' | 'viewer';
    requireAuth?: boolean; // Just require any authentication
    fallback?: React.ReactNode; // Optional fallback UI
}

// Role hierarchy: admin > editor > viewer
const ROLE_HIERARCHY = {
    admin: 3,
    editor: 2,
    viewer: 1
};

export function RoleGuard({
    children,
    requiredRole,
    requireAuth = false,
    fallback = null
}: RoleGuardProps) {
    const { isAuthenticated, user } = useAuth();

    // Check if authentication is required
    if (requireAuth && !isAuthenticated) {
        return <>{fallback}</>;
    }

    // Check role if specified
    if (requiredRole && isAuthenticated && user) {
        const userRoleLevel = ROLE_HIERARCHY[user.role] || 0;
        const requiredRoleLevel = ROLE_HIERARCHY[requiredRole] || 0;

        // User must have equal or higher role level
        if (userRoleLevel < requiredRoleLevel) {
            return <>{fallback}</>;
        }
    }

    // Render children if all checks pass
    return <>{children}</>;
}

/**
 * Hook to check if user has required role
 */
export function useRoleCheck(requiredRole?: 'admin' | 'editor' | 'viewer'): boolean {
    const { isAuthenticated, user } = useAuth();

    if (!requiredRole || !isAuthenticated || !user) {
        return isAuthenticated;
    }

    const userRoleLevel = ROLE_HIERARCHY[user.role] || 0;
    const requiredRoleLevel = ROLE_HIERARCHY[requiredRole] || 0;

    return userRoleLevel >= requiredRoleLevel;
}
