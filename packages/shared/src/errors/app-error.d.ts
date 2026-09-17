import { ErrorCode } from './error-codes';
/**
 * Base application error. All domain errors should extend this.
 * The NestJS exception filter catches AppError and maps it to the
 * standard API error envelope.
 */
export declare class AppError extends Error {
    readonly code: ErrorCode;
    readonly statusCode: number;
    readonly details?: unknown[];
    readonly isOperational: boolean;
    constructor(code: ErrorCode, message: string, statusCode?: number, details?: unknown[]);
}
/** 400 Bad Request */
export declare class BadRequestError extends AppError {
    constructor(code: ErrorCode, message: string, details?: unknown[]);
}
/** 401 Unauthorized */
export declare class UnauthorizedError extends AppError {
    constructor(code?: ErrorCode, message?: string);
}
/** 403 Forbidden */
export declare class ForbiddenError extends AppError {
    constructor(code?: ErrorCode, message?: string);
}
/** 404 Not Found */
export declare class NotFoundError extends AppError {
    constructor(code?: ErrorCode, message?: string);
}
/** 409 Conflict */
export declare class ConflictError extends AppError {
    constructor(code: ErrorCode, message: string);
}
/** 422 Unprocessable Entity — business rule violations */
export declare class BusinessRuleError extends AppError {
    constructor(code: ErrorCode, message: string, details?: unknown[]);
}
/** 429 Too Many Requests */
export declare class RateLimitError extends AppError {
    constructor(code?: ErrorCode, message?: string);
}
/** 500 Internal Server Error — should never reach the client in detail */
export declare class InternalError extends AppError {
    constructor(message?: string);
}
/** 503 Service Unavailable */
export declare class ServiceUnavailableError extends AppError {
    constructor(message?: string);
}
/** Thrown when an invalid state machine transition is attempted */
export declare class InvalidTransitionError extends BusinessRuleError {
    constructor(fromStatus: string, toStatus: string);
}
/** Thrown when a payment idempotency key is reused */
export declare class IdempotencyError extends ConflictError {
    constructor();
}
//# sourceMappingURL=app-error.d.ts.map