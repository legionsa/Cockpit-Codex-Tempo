import bcrypt from 'bcryptjs';

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

/**
 * Verify a password against a bcrypt hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

/**
 * Set page access in session storage with 24h expiry
 */
export function setPageAccess(pageId: string): void {
    const expiry = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
    const accessData = {
        granted: true,
        expiresAt: expiry
    };
    sessionStorage.setItem(`page_access_${pageId}`, JSON.stringify(accessData));
}

/**
 * Check if user has access to a page
 */
export function checkPageAccess(pageId: string): boolean {
    const stored = sessionStorage.getItem(`page_access_${pageId}`);
    if (!stored) return false;

    try {
        const accessData = JSON.parse(stored);
        if (Date.now() > accessData.expiresAt) {
            // Access expired, remove it
            sessionStorage.removeItem(`page_access_${pageId}`);
            return false;
        }
        return accessData.granted;
    } catch {
        return false;
    }
}

/**
 * Remove page access from session storage
 */
export function clearPageAccess(pageId: string): void {
    sessionStorage.removeItem(`page_access_${pageId}`);
}

/**
 * Clear all page access tokens
 */
export function clearAllPageAccess(): void {
    const keys = Object.keys(sessionStorage);
    keys.forEach(key => {
        if (key.startsWith('page_access_')) {
            sessionStorage.removeItem(key);
        }
    });
}
