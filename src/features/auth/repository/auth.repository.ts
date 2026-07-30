import { adminAuth } from '@/lib/firebase/admin';

const FIREBASE_AUTH_URL =
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`;

class AuthRepository {
    /**
     * Authenticate email/password using Firebase Auth REST API.
     * Returns the Firebase ID token.
     */
    async login(email: string, password: string) {
        const response = await fetch(FIREBASE_AUTH_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password,
                returnSecureToken: true,
            }),
        });

        if (!response.ok) {
            throw new Error('Invalid email or password');
        }

        return response.json() as Promise<{
            idToken: string;
            refreshToken: string;
            expiresIn: string;
            localId: string;
        }>;
    }

    /**
     * Create Firebase session cookie.
     */
    async createSession(idToken: string, expiresIn: number) {
        return adminAuth.createSessionCookie(idToken, {
            expiresIn,
        });
    }

    /**
     * Verify Firebase session cookie.
     */
    async verifySession(sessionCookie: string) {
        return adminAuth.verifySessionCookie(sessionCookie, true);
    }

    /**
     * Verify ID token.
     */
    async verifyIdToken(idToken: string) {
        return adminAuth.verifyIdToken(idToken, true);
    }

    /**
     * Get Firebase user.
     */
    async getUser(uid: string) {
        return adminAuth.getUser(uid);
    }

    /**
     * Logout user by revoking refresh tokens.
     */
    async logout(uid: string) {
        await adminAuth.revokeRefreshTokens(uid);
    }
}

export const authRepository = new AuthRepository();