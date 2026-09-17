"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateId = generateId;
exports.generatePublicId = generatePublicId;
exports.generateSlug = generateSlug;
const ulid_1 = require("ulid");
/**
 * Generate a ULID — Universally Unique Lexicographically Sortable Identifier.
 *
 * Properties:
 * - Time-sortable (first 10 chars encode timestamp)
 * - Monotonically sortable within the same millisecond
 * - URL-safe (Crockford's Base32)
 * - 26 characters (stored as VARCHAR(26))
 * - Not sequentially guessable (unlike auto-increment)
 *
 * Use this everywhere IDs are generated — never use Math.random() or uuid v4
 * directly for entity IDs.
 */
function generateId() {
    return (0, ulid_1.ulid)();
}
/**
 * Generate a human-readable public ID for commitments, users, businesses.
 * Format: AH-XXXXXXXX (8 alphanumeric characters, uppercase)
 * Example: AH-82F9KD3M
 *
 * This is used in URLs and public-facing references.
 * It is NOT the database primary key — use generateId() for PKs.
 */
function generatePublicId(prefix = 'AH') {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Crockford alphabet (no I, O, 0, 1)
    let result = prefix + '-';
    for (let i = 0; i < 8; i++) {
        result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
}
/**
 * Generate a URL-safe slug from a business or group name.
 */
function generateSlug(name) {
    return (name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .substring(0, 100) +
        '-' +
        (0, ulid_1.ulid)().slice(-6).toLowerCase());
}
//# sourceMappingURL=id.js.map