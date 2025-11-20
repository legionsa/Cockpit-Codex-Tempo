/**
 * Web Crypto API utilities for password hashing
 * Uses PBKDF2 with 100,000 iterations for secure client-side password hashing
 */

/**
 * Hash password using PBKDF2
 * @param password Plain text password
 * @returns Base64 encoded hash with salt (salt + hash combined)
 */
export async function hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);

    // Generate random salt (16 bytes)
    const salt = crypto.getRandomValues(new Uint8Array(16));

    // Import password as key material
    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        data,
        'PBKDF2',
        false,
        ['deriveBits']
    );

    // Derive bits using PBKDF2
    const derivedBits = await crypto.subtle.deriveBits(
        {
            name: 'PBKDF2',
            salt,
            iterations: 100000, // 100k iterations (~100ms on modern devices)
            hash: 'SHA-256'
        },
        keyMaterial,
        256 // 32 bytes
    );

    // Combine salt + hash
    const hashArray = new Uint8Array(derivedBits);
    const combined = new Uint8Array(salt.length + hashArray.length);
    combined.set(salt);
    combined.set(hashArray, salt.length);

    // Encode as base64
    return btoa(String.fromCharCode(...combined));
}

/**
 * Verify password against stored hash
 * @param password Plain text password to check
 * @param storedHash Base64 encoded hash with salt
 * @returns true if password matches
 */
export async function verifyPassword(
    password: string,
    storedHash: string
): Promise<boolean> {
    try {
        // Decode base64
        const combined = Uint8Array.from(atob(storedHash), c => c.charCodeAt(0));

        // Extract salt (first 16 bytes) and original hash (remaining bytes)
        const salt = combined.slice(0, 16);
        const originalHash = combined.slice(16);

        // Hash input password with same salt
        const encoder = new TextEncoder();
        const data = encoder.encode(password);

        const keyMaterial = await crypto.subtle.importKey(
            'raw',
            data,
            'PBKDF2',
            false,
            ['deriveBits']
        );

        const derivedBits = await crypto.subtle.deriveBits(
            {
                name: 'PBKDF2',
                salt,
                iterations: 100000,
                hash: 'SHA-256'
            },
            keyMaterial,
            256
        );

        const newHash = new Uint8Array(derivedBits);

        // Constant-time comparison to prevent timing attacks
        return timingSafeEqual(originalHash, newHash);
    } catch (error) {
        console.error('Password verification error:', error);
        return false;
    }
}

/**
 * Timing-safe comparison to prevent timing attacks
 * Compares two Uint8Arrays in constant time
 */
function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
    if (a.length !== b.length) return false;

    let result = 0;
    for (let i = 0; i < a.length; i++) {
        result |= a[i] ^ b[i];
    }

    return result === 0;
}

/**
 * Generate a random session ID
 * @returns Cryptographically secure random UUID
 */
export function generateSessionId(): string {
    return crypto.randomUUID();
}

/**
 * Create a session object with expiry
 * @param userId User identifier
 * @param expiryHours Hours until expiry (default: 24)
 * @returns Session object
 */
export function createSession(userId: string, expiryHours: number = 24) {
    return {
        id: generateSessionId(),
        userId,
        createdAt: Date.now(),
        expiresAt: Date.now() + (expiryHours * 60 * 60 * 1000)
    };
}

/**
 * Check if a session is still valid
 * @param session Session object
 * @returns true if session is valid and not expired
 */
export function isSessionValid(session: { expiresAt: number } | null | undefined): boolean {
    if (!session) return false;
    return session.expiresAt > Date.now();
}
