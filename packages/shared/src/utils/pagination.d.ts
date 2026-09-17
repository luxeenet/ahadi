import type { CursorPaginationQuery, PaginationMeta } from '@ahadi/types';
export interface PaginatedResult<T> {
    items: T[];
    meta: PaginationMeta;
}
export declare const DEFAULT_PAGE_LIMIT = 20;
export declare const MAX_PAGE_LIMIT = 100;
/**
 * Parse and validate pagination query parameters.
 * Returns safe defaults if values are missing or invalid.
 */
export declare function parsePaginationQuery(query: CursorPaginationQuery): Required<CursorPaginationQuery>;
/**
 * Build pagination meta from a result set.
 * Items are sliced to `limit`; if more exist, nextCursor is set.
 */
export declare function buildPaginationMeta<T extends {
    id: string;
}>(items: T[], limit: number, total?: number): {
    items: T[];
    meta: PaginationMeta;
};
//# sourceMappingURL=pagination.d.ts.map