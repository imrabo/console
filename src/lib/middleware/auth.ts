/**
 * Authentication & Authorization Middleware
 * Use in Next.js API routes and Server Actions
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { AdminFirestoreService, firestoreService } from '../firebase/admin-firestore';
import { COLLECTIONS } from '../constants/COLLECTIONS';



// Response wrapper
export interface AuthContext {
  uid: string;
  email?: string;
  isAdmin: boolean;
  adminRole?: 'SUPER_ADMIN' | 'ADMIN' | 'MODERATOR';
  permissions?: string[];
}

/**
 * Middleware: Verify Firebase token and attach auth context
 */
export async function withAuth(
  handler: (req: NextRequest, context: AuthContext) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    try {
      const authHeader = req.headers.get('authorization');

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'UNAUTHORIZED',
              message: 'No authorization header provided',
            },
          },
          { status: 401 }
        );
      }

      const token = authHeader.substring(7);
      const auth = getAuth();

      try {
        const decodedToken = await auth.verifyIdToken(token);

        // Check if user is admin
        const db = getFirestore();
        const adminService = new AdminFirestoreService();
        const isAdmin = await adminService.isActive(decodedToken.uid);

        // Build auth context
        const authContext: AuthContext = {
          uid: decodedToken.uid,
          email: decodedToken.email,
          isAdmin,
        };

        if (isAdmin) {
          const adminDoc = await db.collection(COLLECTIONS.ADMIN_USERS).doc(decodedToken.uid).get();
          if (adminDoc.exists) {
            const adminData = adminDoc.data();
            authContext.adminRole = adminData?.role;
            authContext.permissions = adminData?.permissions || [];
          }
        }

        return handler(req, authContext);
      } catch (authError) {
        console.error('Token verification failed:', authError);
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'INVALID_TOKEN',
              message: 'Invalid or expired token',
            },
          },
          { status: 401 }
        );
      }
    } catch (error) {
      console.error('Auth middleware error:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Internal server error',
          },
        },
        { status: 500 }
      );
    }
  };
}

/**
 * Middleware: Require admin role
 */
export async function withAdminAuth(
  handler: (req: NextRequest, context: AuthContext) => Promise<NextResponse>,
  requiredRole?: 'SUPER_ADMIN' | 'ADMIN' | 'MODERATOR'
) {
  return withAuth(async (req, context) => {
    if (!context.isAdmin) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'Admin access required',
          },
        },
        { status: 403 }
      );
    }

    if (requiredRole && context.adminRole !== requiredRole) {
      // Check role hierarchy: SUPER_ADMIN > ADMIN > MODERATOR
      const roleHierarchy = {
        SUPER_ADMIN: 3,
        ADMIN: 2,
        MODERATOR: 1,
      };

      if (!context.adminRole || roleHierarchy[context.adminRole] < roleHierarchy[requiredRole]) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'FORBIDDEN',
              message: `${requiredRole} access required`,
            },
          },
          { status: 403 }
        );
      }
    }

    return handler(req, context);
  });
}

/**
 * Middleware: Require specific permission
 */
export async function withPermission(
  handler: (req: NextRequest, context: AuthContext) => Promise<NextResponse>,
  requiredPermission: string
) {
  return withAuth(async (req, context) => {
    if (!context.isAdmin) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'Admin access required',
          },
        },
        { status: 403 }
      );
    }

    if (!context.permissions?.includes(requiredPermission)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: `Permission required: ${requiredPermission}`,
          },
        },
        { status: 403 }
      );
    }

    return handler(req, context);
  });
}

/**
 * Usage Example in API Route:
 *
 * export const GET = withAuth(async (req, context) => {
 *   console.log('Authenticated user:', context.uid);
 *   return NextResponse.json({ success: true });
 * });
 *
 * export const POST = withAdminAuth(async (req, context) => {
 *   console.log('Admin user:', context.uid, 'Role:', context.adminRole);
 *   return NextResponse.json({ success: true });
 * }, 'SUPER_ADMIN');
 *
 * export const PATCH = withPermission(async (req, context) => {
 *   console.log('User has permission:', context.uid);
 *   return NextResponse.json({ success: true });
 * }, 'products:write');
 */
