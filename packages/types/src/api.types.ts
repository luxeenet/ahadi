// ============================================================
// API Response Types — shared between backend and any client
// ============================================================

export interface ApiSuccess<T = unknown> {
  success: true;
  data: T;
  meta?: ApiMeta;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: ValidationErrorDetail[];
    requestId?: string;
    timestamp?: string;
  };
}

export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError;

export interface ApiMeta {
  requestId?: string;
  timestamp?: string;
  pagination?: PaginationMeta;
}

export interface PaginationMeta {
  cursor?: string;
  nextCursor?: string;
  hasMore: boolean;
  total?: number;
  limit: number;
}

export interface ValidationErrorDetail {
  field: string;
  message: string;
  code?: string;
}

export interface CursorPaginationQuery {
  cursor?: string;
  limit?: number;
  sort?: string;
  direction?: 'asc' | 'desc';
}
