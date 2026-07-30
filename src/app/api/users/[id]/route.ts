import { NextResponse } from 'next/server';

import { verifySession } from '@/lib/auth/session';
import { usersRepository } from '@/features/users/repository/user.repository';

export async function GET(
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await verifySession();

  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { id } = await context.params;

    const user = await usersRepository.findById(id);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Failed to get user:', error);

    return NextResponse.json(
      { error: 'Failed to get user' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await verifySession();

  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { id } = await context.params;
    const payload = await request.json();

    const user = await usersRepository.update(id, payload);

    return NextResponse.json(user);
  } catch (error) {
    console.error('Failed to update user:', error);

    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await verifySession();

  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { id } = await context.params;

    await usersRepository.delete(id);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('Failed to delete user:', error);

    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}