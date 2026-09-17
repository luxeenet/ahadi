import { ErrorCode } from './error-codes';

/**
 * Base application error. All domain errors should extend this.
 * The NestJS exception filter catches AppError and maps it to the
 * standard API error envelope.
 */
export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly details?: unknown[];
  public readonly isOperational: boolean;

  constructor(
    code: ErrorCode,
    message: string,
    statusCode = 400,
    details?: unknown[],
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;

    // Maintains proper stack trace (V8 only)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/** 400 Bad Request */
export class BadRequestError extends AppError {
  constructor(code: ErrorCode, message: string, details?: unknown[]) {
    super(code, message, 400, details);
  }
}

/** 401 Unauthorized */
export class UnauthorizedError extends AppError {
  constructor(code: ErrorCode = 'UNAUTHORIZED', message = 'Authentication required') {
    super(code, message, 401);
  }
}

/** 403 Forbidden */
export class ForbiddenError extends AppError {
  constructor(code: ErrorCode = 'FORBIDDEN', message = 'Access denied') {
    super(code, message, 403);
  }
}

/** 404 Not Found */
export class NotFoundError extends AppError {
  constructor(code: ErrorCode = 'NOT_FOUND', message = 'Resource not found') {
    super(code, message, 404);
  }
}

/** 409 Conflict */
export class ConflictError extends AppError {
  constructor(code: ErrorCode, message: string) {
    super(code, message, 409);
  }
}

/** 422 Unprocessable Entity — business rule violations */
export class BusinessRuleError extends AppError {
  constructor(code: ErrorCode, message: string, details?: unknown[]) {
    super(code, message, 422, details);
  }
}

/** 429 Too Many Requests */
export class RateLimitError extends AppError {
  constructor(code: ErrorCode = 'RATE_LIMIT_EXCEEDED', message = 'Rate limit exceeded') {
    super(code, message, 429);
  }
}

/** 500 Internal Server Error — should never reach the client in detail */
export class InternalError extends AppError {
  constructor(message = 'An internal error occurred', cause?: unknown) {
    super(ErrorCode.INTERNAL_ERROR, message, 500, cause ? [cause] : undefined);
    (this as any).isOperational = false; // Non-operational errors trigger alerts
  }
}

/** 503 Service Unavailable */
export class ServiceUnavailableError extends AppError {
  constructor(message = 'Service temporarily unavailable') {
    super('SERVICE_UNAVAILABLE', message, 503);
  }
}

/** Thrown when an invalid state machine transition is attempted */
export class InvalidTransitionError extends BusinessRuleError {
  constructor(fromStatus: string, toStatus: string) {
    super(
      'INVALID_STATUS_TRANSITION',
      `Cannot transition from ${fromStatus} to ${toStatus}`,
    );
  }
}

/** Thrown when a payment idempotency key is reused */
export class IdempotencyError extends ConflictError {
  constructor() {
    super('PAYMENT_INTENT_DUPLICATE', 'A payment with this idempotency key already exists');
  }
}
