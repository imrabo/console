export class AppError extends Error {
  public code: string;
  public details?: unknown;

  constructor(message: string, code = 'APP_ERROR', details?: unknown) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

