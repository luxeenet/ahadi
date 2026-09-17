"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdempotencyError = exports.InvalidTransitionError = exports.ServiceUnavailableError = exports.InternalError = exports.RateLimitError = exports.BusinessRuleError = exports.ConflictError = exports.NotFoundError = exports.ForbiddenError = exports.UnauthorizedError = exports.BadRequestError = exports.AppError = void 0;
/**
 * Base application error. All domain errors should extend this.
 * The NestJS exception filter catches AppError and maps it to the
 * standard API error envelope.
 */
class AppError extends Error {
    code;
    statusCode;
    details;
    isOperational;
    constructor(code, message, statusCode = 400, details) {
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
exports.AppError = AppError;
/** 400 Bad Request */
class BadRequestError extends AppError {
    constructor(code, message, details) {
        super(code, message, 400, details);
    }
}
exports.BadRequestError = BadRequestError;
/** 401 Unauthorized */
class UnauthorizedError extends AppError {
    constructor(code = 'UNAUTHORIZED', message = 'Authentication required') {
        super(code, message, 401);
    }
}
exports.UnauthorizedError = UnauthorizedError;
/** 403 Forbidden */
class ForbiddenError extends AppError {
    constructor(code = 'FORBIDDEN', message = 'Access denied') {
        super(code, message, 403);
    }
}
exports.ForbiddenError = ForbiddenError;
/** 404 Not Found */
class NotFoundError extends AppError {
    constructor(code = 'NOT_FOUND', message = 'Resource not found') {
        super(code, message, 404);
    }
}
exports.NotFoundError = NotFoundError;
/** 409 Conflict */
class ConflictError extends AppError {
    constructor(code, message) {
        super(code, message, 409);
    }
}
exports.ConflictError = ConflictError;
/** 422 Unprocessable Entity — business rule violations */
class BusinessRuleError extends AppError {
    constructor(code, message, details) {
        super(code, message, 422, details);
    }
}
exports.BusinessRuleError = BusinessRuleError;
/** 429 Too Many Requests */
class RateLimitError extends AppError {
    constructor(code = 'RATE_LIMIT_EXCEEDED', message = 'Rate limit exceeded') {
        super(code, message, 429);
    }
}
exports.RateLimitError = RateLimitError;
/** 500 Internal Server Error — should never reach the client in detail */
class InternalError extends AppError {
    constructor(message = 'An internal error occurred') {
        super('INTERNAL_ERROR', message, 500);
        this.isOperational = false; // Non-operational errors trigger alerts
    }
}
exports.InternalError = InternalError;
/** 503 Service Unavailable */
class ServiceUnavailableError extends AppError {
    constructor(message = 'Service temporarily unavailable') {
        super('SERVICE_UNAVAILABLE', message, 503);
    }
}
exports.ServiceUnavailableError = ServiceUnavailableError;
/** Thrown when an invalid state machine transition is attempted */
class InvalidTransitionError extends BusinessRuleError {
    constructor(fromStatus, toStatus) {
        super('INVALID_STATUS_TRANSITION', `Cannot transition from ${fromStatus} to ${toStatus}`);
    }
}
exports.InvalidTransitionError = InvalidTransitionError;
/** Thrown when a payment idempotency key is reused */
class IdempotencyError extends ConflictError {
    constructor() {
        super('PAYMENT_INTENT_DUPLICATE', 'A payment with this idempotency key already exists');
    }
}
exports.IdempotencyError = IdempotencyError;
//# sourceMappingURL=app-error.js.map