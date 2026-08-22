/**
 * HTTP Client & Response Utilities
 *
 * Standardized Axios API communication.
 *
 * Authentication:
 * - Access token is kept in memory.
 * - Refresh token is stored by the backend as an HttpOnly cookie.
 * - Axios sends cookies with `withCredentials: true`.
 * - Access token is attached as `Authorization: Bearer <token>`.
 */

import type { ApiResponse } from '@/types/api-response.types';
import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';


// ============================================================
// API TYPES
// ============================================================

/**
 * Standard API error details.
 */
export interface ApiErrorDetails {
  [key: string]: unknown;
}



/**
 * Standard API pagination.
 */
export interface Pagination {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}


// ============================================================
// API ERROR
// ============================================================

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: ApiErrorDetails;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'API_ERROR',
    details?: ApiErrorDetails,
  ) {
    super(message);

    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;

    Object.setPrototypeOf(
      this,
      ApiError.prototype,
    );
  }
}


// ============================================================
// ACCESS TOKEN MANAGEMENT
// ============================================================

/**
 * Access token is intentionally kept in memory.
 *
 * Do NOT store it in localStorage/sessionStorage if your
 * authentication architecture requires memory-only JWT storage.
 */

let accessToken: string | null = null;


/**
 * Set access token.
 */
export const setAccessToken = (
  token: string | null,
): void => {
  accessToken = token;
};


/**
 * Get access token.
 */
export const getAccessToken = (): string | null => {
  return accessToken;
};


/**
 * Clear access token.
 */
export const clearAccessToken = (): void => {
  accessToken = null;
};


// ============================================================
// AXIOS CONFIGURATION
// ============================================================

const API_BASE_URL =
  import.meta.env.VITE_PUBLIC_API_URL;


/**
 * Axios instance.
 */
const axiosClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,

  timeout: 30_000,

  /**
   * Required for HttpOnly refresh-token cookies.
   */
  withCredentials: true,

  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});


// ============================================================
// REQUEST INTERCEPTOR
// ============================================================

axiosClient.interceptors.request.use(
  (
    config: InternalAxiosRequestConfig,
  ) => {

    const token = getAccessToken();

    /**
     * Add access JWT to protected requests.
     */
    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  },
);


// ============================================================
// REFRESH STATE
// ============================================================

let isRefreshing = false;

let refreshPromise: Promise<string | null> | null = null;


// ============================================================
// REFRESH ACCESS TOKEN
// ============================================================

const refreshAccessToken =
  async (): Promise<string | null> => {

    /**
     * Prevent multiple simultaneous refresh calls.
     *
     * If five API requests receive 401 at the same time,
     * only one /refresh request is sent.
     */

    if (isRefreshing && refreshPromise) {
      return refreshPromise;
    }

    isRefreshing = true;

    refreshPromise = (async () => {
      try {
        const response =
          await axiosClient.post<
            ApiResponse<{
              access_token: string;
              token_type: string;
            }>
          >(
            '/auth-user/refresh',
            {},
          );

        const token =
          response.data?.data?.access_token;

        if (!token) {
          clearAccessToken();

          return null;
        }

        setAccessToken(token);

        return token;

      } catch {
        clearAccessToken();

        return null;

      } finally {
        isRefreshing = false;
        refreshPromise = null;
      }
    })();

    return refreshPromise;
  };


// ============================================================
// RESPONSE INTERCEPTOR
// ============================================================

axiosClient.interceptors.response.use(

  /**
   * Successful response.
   */
  (
    response: AxiosResponse,
  ) => {

    const body =
      response.data as
      | ApiResponse
      | unknown;

    /**
     * If backend returned our standard envelope,
     * validate the `success` field.
     */
    if (
      body &&
      typeof body === 'object' &&
      'success' in body
    ) {

      const apiResponse =
        body as ApiResponse;

      if (!apiResponse.success) {
        throw new ApiError(
          apiResponse.message
        );
      }
    }

    return response;
  },


  /**
   * Failed response.
   */
  async (
    error: AxiosError,
  ) => {

    const originalRequest =
      error.config as
      | (InternalAxiosRequestConfig & {
        _retry?: boolean;
      })
      | undefined;


    // ----------------------------------------------------
    // No response from server
    // ----------------------------------------------------

    if (!error.response) {
      return Promise.reject(
        new ApiError(
          error.message ||
          'Unable to connect to the server.',
          0,
          'NETWORK_ERROR',
        ),
      );
    }


    const status =
      error.response.status;


    const responseData =
      error.response.data as
      | ApiResponse
      | undefined;


    // ----------------------------------------------------
    // 401 Unauthorized
    // ----------------------------------------------------

    if (
      status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes(
        '/auth-user/refresh',
      ) &&
      !originalRequest.url?.includes(
        '/auth-user/login',
      )
    ) {

      originalRequest._retry = true;


      const newToken =
        await refreshAccessToken();


      if (newToken) {

        originalRequest.headers =
          originalRequest.headers || {};

        originalRequest.headers.Authorization =
          `Bearer ${newToken}`;

        return axiosClient(
          originalRequest,
        );
      }


      /**
       * Refresh failed.
       *
       * Clear in-memory token.
       *
       * Do not redirect here because the API client
       * should not own application routing.
       */

      clearAccessToken();

      return Promise.reject(
        new ApiError(
          responseData?.message ||
          'Authentication required.',
          401,
          responseData?.code ||
          'UNAUTHORIZED',
          responseData?.meta || {},
        ),
      );
    }


    // ----------------------------------------------------
    // API error response
    // ----------------------------------------------------

    const message =
      responseData?.message ||
      `HTTP ${status}`;


    const code =
      responseData?.code ||
      'HTTP_ERROR';


    const details =
      responseData?.meta || {};


    return Promise.reject(
      new ApiError(
        message,
        status,
        code,
        details,
      ),
    );
  },
);


// ============================================================
// API CLIENT
// ============================================================

export class ApiClient {

  private readonly client: AxiosInstance;


  constructor(
    client: AxiosInstance = axiosClient,
  ) {
    this.client = client;
  }


  // ========================================================
  // GET
  // ========================================================

  async get<T>(
    endpoint: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {

    const response =
      await this.client.get<
        ApiResponse<T>
      >(
        endpoint,
        config,
      );

    return response.data;
  }


  // ========================================================
  // POST
  // ========================================================

  async post<T>(
    endpoint: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {

    const response =
      await this.client.post<
        ApiResponse<T>
      >(
        endpoint,
        data,
        config,
      );

    return response.data;
  }


  // ========================================================
  // PATCH
  // ========================================================

  async patch<T>(
    endpoint: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {

    const response =
      await this.client.patch<
        ApiResponse<T>
      >(
        endpoint,
        data,
        config,
      );

    return response.data;
  }


  // ========================================================
  // PUT
  // ========================================================

  async put<T>(
    endpoint: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {

    const response =
      await this.client.put<
        ApiResponse<T>
      >(
        endpoint,
        data,
        config,
      );

    return response.data;
  }


  // ========================================================
  // DELETE
  // ========================================================

  async delete<T>(
    endpoint: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {

    const response =
      await this.client.delete<
        ApiResponse<T>
      >(
        endpoint,
        config,
      );

    return response.data;
  }


  // ========================================================
  // GET WITH QUERY
  // ========================================================

  async getWithQuery<T>(
    endpoint: string,
    params?: Record<
      string,
      string | number | boolean | Date | null | undefined
    >,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {

    const searchParams =
      new URLSearchParams();


    if (params) {

      Object.entries(params).forEach(
        ([key, value]) => {

          if (
            value !== null &&
            value !== undefined
          ) {
            searchParams.set(
              key,
              String(value),
            );
          }
        },
      );
    }


    const queryString =
      searchParams.toString();


    const url =
      queryString
        ? `${endpoint}?${queryString}`
        : endpoint;


    return this.get<T>(
      url,
      config,
    );
  }
}


// ============================================================
// RESPONSE BUILDER
// ============================================================

export class ResponseBuilder {

  /**
   * Build successful API response.
   */
  static success<T>(
    data: T,
    meta?: ApiResponse<T>['meta'],
  ): ApiResponse<T> {

    return {
      success: true,
      data,
      meta: {
        timestamp: new Date().toISOString(),

        version: 'v1',

        ...meta,
      },

      code: '',
      message: '',

    };
  }


  /**
   * Build error API response.
   */
  static error(
    message: string,
    code: string = 'ERROR',
    details?: ApiErrorDetails,
  ): ApiResponse<null> {

    return {
      success: false,

      data: null,

      errors: [
        {
          code,
          message,
          ...details,
        }
      ],

      meta: {
        timestamp: new Date().toISOString(),

        version: 'v1',
      },

      code: '',
      message: '',

    };
  }


  /**
   * Build paginated API response.
   */
  static paginated<T>(
    items: T[],
    total: number,
    page: number,
    pageSize: number,
  ): ApiResponse<T[]> {

    const totalPages =
      Math.ceil(
        total / pageSize,
      );

    return {
      success: true,

      data: items,

      meta: {
        timestamp: new Date().toISOString(),

        version: 'v1',

        pagination: {
          total,
          page,
          pageSize,
          totalPages,
        },
      },

      code: '',
      message: '',

    };
  }
}


// ============================================================
// VALIDATION ERROR BUILDER
// ============================================================

export class ValidationErrorBuilder {

  private errors: Record<
    string,
    string[]
  > = {};


  addError(
    field: string,
    message: string,
  ): this {

    if (!this.errors[field]) {
      this.errors[field] = [];
    }

    this.errors[field].push(
      message,
    );

    return this;
  }


  hasErrors(): boolean {
    return (
      Object.keys(
        this.errors,
      ).length > 0
    );
  }


  build(): ApiResponse<null> {

    return ResponseBuilder.error(
      'Validation failed',
      'VALIDATION_ERROR',
      this.errors,
    );
  }
}


// ============================================================
// SINGLE API CLIENT INSTANCE
// ============================================================

export const apiClient =
  new ApiClient();


// ============================================================
// EXPORT AXIOS INSTANCE
// ============================================================

export {
  axiosClient,
};

