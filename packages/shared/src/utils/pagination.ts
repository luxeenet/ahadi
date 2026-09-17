import type { CursorPaginationQuery, PaginationMeta } from '@ahadi/types';

export interface PaginatedResult<T> {
  items: T[];
  meta: PaginationMeta;
}

export const DEFAULT_PAGE_LIMIT = 20;
export const MAX_PAGE_LIMIT = 100;

/**
 * Parse and validate pagination query parameters.
 * Returns safe defaults if values are missing or invalid.
 */
export function parsePaginationQuery(query: CursorPaginationQuery): Required<CursorPaginationQuery> {
  const limit = Math.min(
    Math.max(1, Number(query.limit ?? DEFAULT_PAGE_LIMIT)),
    MAX_PAGE_LIMIT,
  );
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
export function buildPaginationMeta<T extends { id: string }>(
  items: T[],
  limit: number,
  total?: number,
): { items: T[]; meta: PaginationMeta } {
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
