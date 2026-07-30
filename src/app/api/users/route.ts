import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';

import { verifySession } from '@/lib/auth/session';
import { createUserSchema, userPreferencesSchema } from '@/features/users';
import { usersRepository } from '@/features/users/repository/user.repository';


export async function GET() {
  try {
    const session = await verifySession();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const users = await usersRepository.findAll();

    return NextResponse.json(users);
  } catch (error) {
    console.error('Failed to fetch users:', error);

    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await verifySession();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    const data = createUserSchema.parse(body);

    const user = await usersRepository.create({


      fullName: data.fullName,
      email: data.email,
      mobileNo: data.mobileNo,

      membershipType: data.membershipType,

      // dateOfBirth: data.dateOfBirth,
      gender: data.gender,


      // children: data?.children,



    });

    return NextResponse.json(user, {
      status: 201,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          issues: error.flatten(),
        },
        {
          status: 400,
        }
      );
    }

    console.error('Failed to create user:', error);

    return NextResponse.json(
      {
        error: 'Failed to create user',
      },
      {
        status: 500,
      }
    );
  }
}