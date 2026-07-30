import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { authRepository } from '@/features/auth/repository/auth.repository';
import { SESSION_COOKIE_NAME } from '@/lib/auth/session';

export async function GET() {
    try {
        const cookieStore = await cookies();

        const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

        if (!sessionCookie) {
            return NextResponse.json(null, { status: 401 });
        }

        const decoded = await authRepository.verifySession(sessionCookie);

        const user = await authRepository.getUser(decoded.uid);

        return NextResponse.json(user);
    } catch {
        return NextResponse.json(null, { status: 401 });
    }
}