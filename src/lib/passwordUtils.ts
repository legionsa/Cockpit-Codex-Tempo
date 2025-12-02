import { hashPassword as cryptoHash, verifyPassword as cryptoVerify } from './crypto';

/**
 * Hash a password using PBKDF2 (native Web Crypto API)
 */
export async function hashPassword(password: string): Promise<string> {
    return cryptoHash(password);
}

/**
 * Verify a password against a PBKDF2 hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return cryptoVerify(password, hash);
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
