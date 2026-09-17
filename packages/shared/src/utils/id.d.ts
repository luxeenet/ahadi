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
export declare function generateId(): string;
/**
 * Generate a human-readable public ID for commitments, users, businesses.
 * Format: AH-XXXXXXXX (8 alphanumeric characters, uppercase)
 * Example: AH-82F9KD3M
 *
 * This is used in URLs and public-facing references.
 * It is NOT the database primary key — use generateId() for PKs.
 */
export declare function generatePublicId(prefix?: string): string;
/**
 * Generate a URL-safe slug from a business or group name.
 */
export declare function generateSlug(name: string): string;
//# sourceMappingURL=id.d.ts.map