// Define standardized error codes across the application
export type ErrorCode =
  | "NETWORK_ERROR"
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "STORAGE_ERROR"
  | "UNKNOWN_ERROR";

// Custom Application Error class for structured error tracking
export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode?: number;

  constructor(message: string, code: ErrorCode = "UNKNOWN_ERROR", statusCode?: number) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCode;
  }
}

// Generic Result Pattern type to avoid unhandled exceptions in UI layers
export type Result<T> =
  | { isSuccess: true; data: T; error: null }
  | { isSuccess: false; data: null; error: AppError };

// Helper factory methods for creating Result objects cleanly
export const ResultFactory = {
  success<T>(data: T): Result<T> {
    return { isSuccess: true, data, error: null };
  },
  failure<T>(message: string, code: ErrorCode = "UNKNOWN_ERROR", statusCode?: number): Result<T> {
    return {
      isSuccess: false,
      data: null,
      error: new AppError(message, code, statusCode),
    };
  },
};