import { NextRequest, NextResponse } from 'next/server';
import { authRepository } from '@/features/auth/repository/auth.repository';
import { SESSION_COOKIE_NAME } from '@/lib/auth/session';

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        const { idToken } = await authRepository.login(email, password);

        const expiresIn = 1000 * 60 * 60 * 24 * 7;

        const sessionCookie = await authRepository.createSession(
            idToken,
            expiresIn
        );

        const decoded = await authRepository.verifySession(sessionCookie);

        const user = await authRepository.getUser(decoded.uid);

        const response = NextResponse.json(user);

        response.cookies.set(SESSION_COOKIE_NAME, sessionCookie, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: expiresIn / 1000,
        });

        return response;
    } catch (error) {
        return NextResponse.json(
            {
                message:
                    error instanceof Error ? error.message : 'Invalid credentials',
            },
            { status: 401 }
        );
    }
}