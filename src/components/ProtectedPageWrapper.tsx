import React, { useState, useEffect } from 'react';
import { Page } from '@/types/page';
import { checkPageAccess } from '@/lib/passwordUtils';
import { PasswordPrompt } from './PasswordPrompt';
import { useAuth } from '@/contexts/AuthContext';
import { useRoleCheck } from './RoleGuard';
import { Link } from 'react-router-dom';
import { Lock, UserX } from 'lucide-react';
import { Button } from './ui/button';

interface ProtectedPageWrapperProps {
    page: Page;
    children: React.ReactNode;
}

export function ProtectedPageWrapper({ page, children }: ProtectedPageWrapperProps) {
    const { isAuthenticated, user } = useAuth();
    const [hasAccess, setHasAccess] = useState(false);
    const [showPrompt, setShowPrompt] = useState(false);
    const [accessDeniedReason, setAccessDeniedReason] = useState<string | null>(null);

    // Get user's role level for comparison
    const getRoleLevel = (role?: 'admin' | 'editor' | 'viewer'): number => {
        const levels = { admin: 3, editor: 2, viewer: 1 };
        return role ? (levels[role] || 0) : 0;
    };

    useEffect(() => {
        // Check visibility first
        const visibility = page.visibility || 'public';

        // Public pages - always accessible
        if (visibility === 'public') {
            // Still check for password protection
            if (page.passwordProtected && page.passwordHash) {
                if (isAuthenticated) {
                    setHasAccess(true); // Admins bypass passwords
                } else {
                    const hasStoredAccess = checkPageAccess(page.id);
                    if (hasStoredAccess) {
                        setHasAccess(true);
                    } else {
                        setShowPrompt(true);
                    }
                }
            } else {
                setHasAccess(true);
            }
            return;
        }

        // Authenticated pages - require login
        if (visibility === 'authenticated') {
            if (!isAuthenticated) {
                setAccessDeniedReason('You must be logged in to view this page.');
                return;
            }

            // Check password if needed
            if (page.passwordProtected && page.passwordHash) {
                const hasStoredAccess = checkPageAccess(page.id);
                if (hasStoredAccess) {
                    setHasAccess(true);
                } else {
                    setShowPrompt(true);
                }
            } else {
                setHasAccess(true);
            }
            return;
        }

        // Role-restricted pages - require specific role
        if (visibility === 'role-restricted') {
            if (!isAuthenticated) {
                setAccessDeniedReason('You must be logged in with appropriate permissions to view this page.');
                return;
            }

            if (!user) {
                setAccessDeniedReason('User information not available.');
                return;
            }

            // Check role level
            const userLevel = getRoleLevel(user.role);
            const requiredLevel = getRoleLevel(page.requiredRole);

            if (userLevel < requiredLevel) {
                const roleNames = { admin: 'Administrator', editor: 'Editor', viewer: 'Viewer' };
                const requiredRoleName = page.requiredRole ? roleNames[page.requiredRole] : 'Unknown';
                setAccessDeniedReason(`This page requires ${requiredRoleName} role or higher.`);
                return;
            }

            // Role check passed - check password if needed
            if (page.passwordProtected && page.passwordHash) {
                const hasStoredAccess = checkPageAccess(page.id);
                if (hasStoredAccess) {
                    setHasAccess(true);
                } else {
                    setShowPrompt(true);
                }
            } else {
                setHasAccess(true);
            }
        }
    }, [page.id, page.visibility, page.passwordProtected, page.passwordHash, page.requiredRole, isAuthenticated, user]);

    const handlePasswordSuccess = () => {
        setHasAccess(true);
        setShowPrompt(false);
    };

    // Show access denied message
    if (accessDeniedReason) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center max-w-md px-6">
                    <div className="flex justify-center mb-4">
                        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10">
                            <UserX className="w-8 h-8 text-destructive" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
                    <p className="text-muted-foreground mb-6">{accessDeniedReason}</p>
                    {!isAuthenticated && (
                        <Link to="/admindash/login">
                            <Button>Log In</Button>
                        </Link>
                    )}
                </div>
            </div>
        );
    }

    // Show password prompt
    if (showPrompt && !hasAccess && page.passwordHash) {
        return (
            <PasswordPrompt
                open={showPrompt}
                onSuccess={handlePasswordSuccess}
                passwordHash={page.passwordHash}
                pageId={page.id}
                passwordHint={page.passwordHint}
                pageTitle={page.title}
            />
        );
    }

    // Render children if access granted
    if (hasAccess) {
        return <>{children}</>;
    }

    // Loading state
    return null;
}
