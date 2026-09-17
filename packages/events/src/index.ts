export * from '@ahadi/types';

/**
 * Re-exports all domain event types and provides the event bus abstraction.
 *
 * In development: uses an in-process EventEmitter.
 * In production: can be upgraded to Redis Streams or RabbitMQ by
 * swapping this module's implementation without changing consumer code.
 */
