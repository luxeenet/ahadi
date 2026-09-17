/**
 * Date utilities — all operations use UTC internally.
 * Never calculate deadlines from browser-local timestamps.
 */

/** Returns the current UTC timestamp (server authoritative) */
export function nowUtc(): Date {
  return new Date();
}

/** Returns number of milliseconds between two dates */
export function diffMs(a: Date, b: Date): number {
  return b.getTime() - a.getTime();
}

/** Returns number of hours between two dates (positive if b is after a) */
export function diffHours(a: Date, b: Date): number {
  return diffMs(a, b) / (1000 * 60 * 60);
}

/** Returns number of days between two dates */
export function diffDays(a: Date, b: Date): number {
  return diffMs(a, b) / (1000 * 60 * 60 * 24);
}

/** Returns true if a date is in the past (relative to server time) */
export function isPast(date: Date): boolean {
  return date.getTime() < Date.now();
}

/** Returns true if a date is in the future */
export function isFuture(date: Date): boolean {
  return date.getTime() > Date.now();
}

/** Returns true if a due date is within N hours */
export function isDueSoonHours(dueDate: Date, withinHours: number): boolean {
  const diffH = diffHours(nowUtc(), dueDate);
  return diffH > 0 && diffH <= withinHours;
}

/** Returns true if a due date is within N days */
export function isDueSoonDays(dueDate: Date, withinDays: number): boolean {
  const diffD = diffDays(nowUtc(), dueDate);
  return diffD > 0 && diffD <= withinDays;
}

/** Add N days to a date */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

/** Add N hours to a date */
export function addHours(date: Date, hours: number): Date {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
}

/** Add N minutes to a date */
export function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

/** Format a date as ISO 8601 UTC string */
export function toIsoUtc(date: Date): string {
  return date.toISOString();
}

/**
 * Determines if a commitment completed early, on time, or late.
 * Returns hours early (positive) or hours late (negative).
 */
export function completionTimingHours(dueDate: Date, completedAt: Date): number {
  return diffHours(completedAt, dueDate); // positive = early, negative = late
}
