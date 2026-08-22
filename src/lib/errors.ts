export class AppError extends Error {
  public code: string;
  public details?: any;

  constructor(message: string, code = 'APP_ERROR', details?: any) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class FirebaseErrorHandler {
  static handle(error: any): AppError {
    console.error('[Firebase Error Handler]:', error);

    if (error instanceof AppError) {
      return error;
    }

    const code = error?.code || 'unknown';
    let message = error?.message || 'An unexpected error occurred. Please try again.';

    switch (code) {
      // Auth Errors
      case 'auth/invalid-email':
        message = 'The email address is badly formatted.';
        break;
      case 'auth/user-disabled':
        message = 'This administrator account has been disabled.';
        break;
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        message = 'Invalid email address or password.';
        break;
      case 'auth/email-already-in-use':
        message = 'This email address is already in use by another account.';
        break;
      case 'auth/operation-not-allowed':
        message = 'Email/password sign-in is not enabled for this project.';
        break;
      case 'auth/weak-password':
        message = 'The password is too weak. Please choose a stronger password.';
        break;

      // Firestore Errors
      case 'permission-denied':
        message = 'Access Denied: You do not have permissions to perform this operation.';
        break;
      case 'not-found':
        message = 'Requested document or connector could not be found.';
        break;
      case 'already-exists':
        message = 'This connector already exists in the database.';
        break;
      case 'failed-precondition':
        message =
          'The operation failed because the database requires an index. Contact developers.';
        break;
      case 'connector-exhausted':
        message = 'Database quota exceeded. Please try again later.';
        break;
      case 'unavailable':
        message = 'The database service is temporarily unavailable. Check internet connection.';
        break;
    }

    return new AppError(message, code, error);
  }
}
