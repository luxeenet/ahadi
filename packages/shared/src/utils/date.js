"use strict";
/**
 * Date utilities — all operations use UTC internally.
 * Never calculate deadlines from browser-local timestamps.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.nowUtc = nowUtc;
exports.diffMs = diffMs;
exports.diffHours = diffHours;
exports.diffDays = diffDays;
exports.isPast = isPast;
exports.isFuture = isFuture;
exports.isDueSoonHours = isDueSoonHours;
exports.isDueSoonDays = isDueSoonDays;
exports.addDays = addDays;
exports.addHours = addHours;
exports.addMinutes = addMinutes;
exports.toIsoUtc = toIsoUtc;
exports.completionTimingHours = completionTimingHours;
/** Returns the current UTC timestamp (server authoritative) */
function nowUtc() {
    return new Date();
}
/** Returns number of milliseconds between two dates */
function diffMs(a, b) {
    return b.getTime() - a.getTime();
}
/** Returns number of hours between two dates (positive if b is after a) */
function diffHours(a, b) {
    return diffMs(a, b) / (1000 * 60 * 60);
}
/** Returns number of days between two dates */
function diffDays(a, b) {
    return diffMs(a, b) / (1000 * 60 * 60 * 24);
}
/** Returns true if a date is in the past (relative to server time) */
function isPast(date) {
    return date.getTime() < Date.now();
}
/** Returns true if a date is in the future */
function isFuture(date) {
    return date.getTime() > Date.now();
}
/** Returns true if a due date is within N hours */
function isDueSoonHours(dueDate, withinHours) {
    const diffH = diffHours(nowUtc(), dueDate);
    return diffH > 0 && diffH <= withinHours;
}
/** Returns true if a due date is within N days */
function isDueSoonDays(dueDate, withinDays) {
    const diffD = diffDays(nowUtc(), dueDate);
    return diffD > 0 && diffD <= withinDays;
}
/** Add N days to a date */
function addDays(date, days) {
    const result = new Date(date);
    result.setUTCDate(result.getUTCDate() + days);
    return result;
}
/** Add N hours to a date */
function addHours(date, hours) {
    return new Date(date.getTime() + hours * 60 * 60 * 1000);
}
/** Add N minutes to a date */
function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes * 60 * 1000);
}
/** Format a date as ISO 8601 UTC string */
function toIsoUtc(date) {
    return date.toISOString();
}
/**
 * Determines if a commitment completed early, on time, or late.
 * Returns hours early (positive) or hours late (negative).
 */
function completionTimingHours(dueDate, completedAt) {
    return diffHours(completedAt, dueDate); // positive = early, negative = late
}
//# sourceMappingURL=date.js.map