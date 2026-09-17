"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAX_PAGE_LIMIT = exports.DEFAULT_PAGE_LIMIT = void 0;
exports.parsePaginationQuery = parsePaginationQuery;
exports.buildPaginationMeta = buildPaginationMeta;
exports.DEFAULT_PAGE_LIMIT = 20;
exports.MAX_PAGE_LIMIT = 100;
/**
 * Parse and validate pagination query parameters.
 * Returns safe defaults if values are missing or invalid.
 */
function parsePaginationQuery(query) {
    const limit = Math.min(Math.max(1, Number(query.limit ?? exports.DEFAULT_PAGE_LIMIT)), exports.MAX_PAGE_LIMIT);
    return {
        cursor: query.cursor ?? '',
        limit,
        sort: query.sort ?? 'created_at',
        direction: query.direction === 'asc' ? 'asc' : 'desc',
    };
}
/**
 * Build pagination meta from a result set.
 * Items are sliced to `limit`; if more exist, nextCursor is set.
 */
function buildPaginationMeta(items, limit, total) {
    const hasMore = items.length > limit;
    const sliced = hasMore ? items.slice(0, limit) : items;
    const lastItem = sliced[sliced.length - 1];
    return {
        items: sliced,
        meta: {
            limit,
            hasMore,
            nextCursor: hasMore && lastItem ? lastItem.id : undefined,
            total,
        },
    };
}
//# sourceMappingURL=pagination.js.map