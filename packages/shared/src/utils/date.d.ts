/**
 * Date utilities — all operations use UTC internally.
 * Never calculate deadlines from browser-local timestamps.
 */
/** Returns the current UTC timestamp (server authoritative) */
export declare function nowUtc(): Date;
/** Returns number of milliseconds between two dates */
export declare function diffMs(a: Date, b: Date): number;
/** Returns number of hours between two dates (positive if b is after a) */
export declare function diffHours(a: Date, b: Date): number;
/** Returns number of days between two dates */
export declare function diffDays(a: Date, b: Date): number;
/** Returns true if a date is in the past (relative to server time) */
export declare function isPast(date: Date): boolean;
/** Returns true if a date is in the future */
export declare function isFuture(date: Date): boolean;
/** Returns true if a due date is within N hours */
export declare function isDueSoonHours(dueDate: Date, withinHours: number): boolean;
/** Returns true if a due date is within N days */
export declare function isDueSoonDays(dueDate: Date, withinDays: number): boolean;
/** Add N days to a date */
export declare function addDays(date: Date, days: number): Date;
/** Add N hours to a date */
export declare function addHours(date: Date, hours: number): Date;
/** Add N minutes to a date */
export declare function addMinutes(date: Date, minutes: number): Date;
/** Format a date as ISO 8601 UTC string */
export declare function toIsoUtc(date: Date): string;
/**
 * Determines if a commitment completed early, on time, or late.
 * Returns hours early (positive) or hours late (negative).
 */
export declare function completionTimingHours(dueDate: Date, completedAt: Date): number;
//# sourceMappingURL=date.d.ts.map