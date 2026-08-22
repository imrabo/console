// ============================================================
// Pagination
// ============================================================

export interface Pagination {
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_previous: boolean;
}


// ============================================================
// API Error
// ============================================================

export interface ApiError {
    field?: string | null;
    code?: string | null;
    message: string;
}


// ============================================================
// API Response
// ============================================================

export interface ApiResponse<T = unknown> {
    success: boolean;
    code: string;
    message: string;
    data: T | null;
    errors?: ApiError[] | null;
    pagination?: Pagination | null;
    meta?: Record<string, unknown> | null;
}


// ============================================================
// API Result
// ============================================================

export interface ApiResult<T = unknown> {
    data: T | null;
    code: string;
    message: string;
    pagination?: Pagination | null;
    meta?: Record<string, unknown> | null;
}

// src/types/api.ts

// ============================================================
// Pagination
// ============================================================

export interface Pagination {
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_previous: boolean;
}


// ============================================================
// API Error
// ============================================================

export interface ApiError {
    field?: string | null;
    code?: string | null;
    message: string;
}


// ============================================================
// API Response
// ============================================================

export interface ApiResponse<T = unknown> {
    success: boolean;
    code: string;
    message: string;
    data: T | null;
    errors?: ApiError[] | null;
    pagination?: Pagination | null;
    meta?: Record<string, unknown> | null;
}


// ============================================================
// API Result
// ============================================================

export interface ApiResult<T = unknown> {
    data: T | null;
    code: string;
    message: string;
    pagination?: Pagination | null;
    meta?: Record<string, unknown> | null;
}