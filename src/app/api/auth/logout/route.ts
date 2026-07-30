import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { authRepository } from '@/features/auth/repository/auth.repository';
import { SESSION_COOKIE_NAME } from '@/lib/auth/session';

export async function POST() {
  try {
    const cookieStore = await cookies();

    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (sessionCookie) {
      const decoded = await authRepository.verifySession(sessionCookie);

      await authRepository.logout(decoded.uid);
    }

    const response = NextResponse.json({ success: true });

    response.cookies.delete(SESSION_COOKIE_NAME);

    return response;
  } catch {
    const response = NextResponse.json({ success: true });

    response.cookies.delete(SESSION_COOKIE_NAME);

    return response;
  }
}