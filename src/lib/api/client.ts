/**
 * HTTP Client & Response Utilities
 * Standardized API communication patterns
 */

/**
 * Standard API Response Format
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  meta?: {
    timestamp: string;
    version: string;
    pagination?: {
      total: number;
      page: number;
      pageSize: number;
      totalPages: number;
    };
  };
}

/**
 * Supported query parameter values.
 */
export type QueryParamValue = string | number | boolean | Date | null | undefined;

/**
 * Query parameters accepted by the API client.
 */
export type QueryParams = Record<string, QueryParamValue>;

/**
 * HTTP Client for API calls
 */
export class ApiClient {
  private baseUrl: string;
  private timeout: number = 30000;

  constructor(baseUrl: string = import.meta.env.VITE_API_BASE_URL || '/api') {
    this.baseUrl = baseUrl;
  }

  /**
   * Build an endpoint with query parameters.
   */
  private buildUrl(endpoint: string, params?: QueryParams): string {
    if (!params) {
      return `${this.baseUrl}${endpoint}`;
    }

    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();

    return `${this.baseUrl}${endpoint}${queryString ? `?${queryString}` : ''}`;
  }

  /**
   * Make HTTP request with error handling.
   */
  private async request<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE' = 'GET',
    data?: unknown,
    params?: QueryParams
  ): Promise<T> {
    try {
      const url = this.buildUrl(endpoint, params);

      const options: RequestInit = {
        method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(this.timeout),
      };

      if (data !== undefined && method !== 'GET') {
        options.body = JSON.stringify(data);
      }

      const response = await fetch(url, options);

      /**
       * Handle empty responses.
       */
      if (response.status === 204) {
        return undefined as T;
      }

      const contentType = response.headers.get('content-type');

      const body = contentType?.includes('application/json')
        ? ((await response.json()) as ApiResponse<T> | T)
        : undefined;

      const isEnvelope = typeof body === 'object' && body !== null && 'success' in body;

      /**
       * Handle HTTP errors.
       */
 if (!response.ok) {
  const responseObject =
    typeof body === 'object' && body !== null
      ? (body as Record<string, unknown>)
      : undefined;

  const errorValue = responseObject?.error;

  const nestedError =
    typeof errorValue === 'object' && errorValue !== null
      ? (errorValue as Record<string, unknown>)
      : undefined;

  const message =
    typeof nestedError?.message === 'string'
      ? nestedError.message
      : typeof errorValue === 'string'
        ? errorValue
        : typeof responseObject?.message === 'string'
          ? responseObject.message
          : response.statusText || `HTTP ${response.status}`;

  const code =
    typeof nestedError?.code === 'string'
      ? nestedError.code
      : typeof responseObject?.code === 'string'
        ? responseObject.code
        : 'HTTP_ERROR';

  const details =
    typeof nestedError?.details === 'object' &&
    nestedError.details !== null &&
    !Array.isArray(nestedError.details)
      ? (nestedError.details as Record<string, unknown>)
      : undefined;

  throw new ApiError(message, response.status, code, details);
}
      // if (!response.ok) {
      //   const errorBody = isEnvelope ? (body as ApiResponse<T>) : undefined;

      //   throw new ApiError(
      //     errorBody?.error?.message || response.statusText || `HTTP ${response.status}`,
      //     response.status,
      //     errorBody?.error?.code || 'HTTP_ERROR',
      //     errorBody?.error?.details
      //   );
      // }

      /**
       * Handle standardized API response envelope.
       */
      if (isEnvelope) {
        const apiResponse = body as ApiResponse<T>;

        if (!apiResponse.success) {
          throw new ApiError(
            apiResponse.error?.message || 'Request failed',
            response.status,
            apiResponse.error?.code || 'API_ERROR',
            apiResponse.error?.details
          );
        }

        return apiResponse.data as T;
      }

      /**
       * Handle raw API responses.
       */
      return body as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError(
        error instanceof Error ? error.message : 'Unknown error',
        500,
        'UNKNOWN_ERROR'
      );
    }
  }

  /**
   * GET request.
   */
  async get<T>(endpoint: string, params?: QueryParams): Promise<T> {
    return this.request<T>(endpoint, 'GET', undefined, params);
  }

  /**
   * POST request.
   */
  async post<T>(endpoint: string, data?: unknown, params?: QueryParams): Promise<T> {
    return this.request<T>(endpoint, 'POST', data, params);
  }

  /**
   * PATCH request.
   */
  async patch<T>(endpoint: string, data?: unknown, params?: QueryParams): Promise<T> {
    return this.request<T>(endpoint, 'PATCH', data, params);
  }

  /**
   * DELETE request.
   */
  async delete<T>(endpoint: string, params?: QueryParams): Promise<T> {
    return this.request<T>(endpoint, 'DELETE', undefined, params);
  }

  /**
   * Backward-compatible helper for GET requests.
   *
   * @deprecated
   * Use apiClient.get(endpoint, params) instead.
   */
  async getWithQuery<T>(endpoint: string, params?: QueryParams): Promise<T> {
    return this.get<T>(endpoint, params);
  }
}

/**
 * Custom API Error class.
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code: string = 'API_ERROR',
    public details?: Record<string, unknown>
  ) {
    super(message);

    this.name = 'ApiError';

    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

/**
 * Response builder for consistent API responses.
 */
export class ResponseBuilder {
  /**
   * Build success response.
   */
  static success<T>(data: T, meta?: Partial<ApiResponse['meta']>): ApiResponse<T> {
    return {
      success: true,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        version: 'v1',
        ...meta,
      },
    };
  }

  /**
   * Build error response.
   */
  static error(
    message: string,
    code: string = 'ERROR',
    statusCode: number = 400,
    details?: Record<string, unknown>
  ): [ApiResponse, number] {
    return [
      {
        success: false,
        error: {
          code,
          message,
          details,
        },
        meta: {
          timestamp: new Date().toISOString(),
          version: 'v1',
        },
      },
      statusCode,
    ];
  }

  /**
   * Build paginated response.
   */
  static paginated<T>(items: T[], total: number, page: number, pageSize: number): ApiResponse<T[]> {
    const totalPages = pageSize > 0 ? Math.ceil(total / pageSize) : 0;

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
    };
  }
}

/**
 * Validation error response builder.
 */
export class ValidationErrorBuilder {
  private errors: Record<string, string[]> = {};

  addError(field: string, message: string): this {
    if (!this.errors[field]) {
      this.errors[field] = [];
    }

    this.errors[field].push(message);

    return this;
  }

  hasErrors(): boolean {
    return Object.keys(this.errors).length > 0;
  }

  build(): [ApiResponse, number] {
    return ResponseBuilder.error('Validation failed', 'VALIDATION_ERROR', 422, this.errors);
  }
}

/**
 * API client instance.
 */
export const apiClient = new ApiClient();

// /**
//  * HTTP Client & Response Utilities
//  * Standardized API communication patterns
//  */

// /**
//  * Standard API Response Format
//  */
// export interface ApiResponse<T = any> {
//   success: boolean;
//   data?: T;
//   error?: {
//     code: string;
//     message: string;
//     details?: Record<string, any>;
//   };
//   meta?: {
//     timestamp: string;
//     version: string;
//     pagination?: {
//       total: number;
//       page: number;
//       pageSize: number;
//       totalPages: number;
//     };
//   };
// }

// /**
//  * HTTP Client for API calls
//  */
// export class ApiClient {
//   private baseUrl: string;
//   private timeout: number = 30000;

//   constructor(baseUrl: string = import.meta.env.NEXT_PUBLIC_API_URL || '/api') {
//     this.baseUrl = baseUrl;
//   }

//   /**
//    * Make HTTP request with error handling
//    */
//   private async request<T>(
//     endpoint: string,
//     method: 'GET' | 'POST' | 'PATCH' | 'DELETE' = 'GET',
//     data?: unknown
//   ): Promise<T> {
//     try {
//       const url = `${this.baseUrl}${endpoint}`;

//       const options: RequestInit = {
//         method,
//         credentials: 'include', // Send HttpOnly session cookie
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         signal: AbortSignal.timeout(this.timeout),
//       };

//       if (data !== undefined && method !== 'GET') {
//         options.body = JSON.stringify(data);
//       }

//       const response = await fetch(url, options);

//       // Handle empty responses (204 No Content)
//       if (response.status === 204) {
//         return undefined as T;
//       }

//       const contentType = response.headers.get('content-type');

//       const body = contentType?.includes('application/json')
//         ? ((await response.json()) as ApiResponse<T> | T)
//         : undefined;

//       const isEnvelope = typeof body === 'object' && body !== null && 'success' in body;

//       if (!response.ok) {
//         const errorBody = isEnvelope ? (body as ApiResponse<T>) : undefined;

//         throw new ApiError(
//           errorBody?.error?.message || response.statusText || `HTTP ${response.status}`,
//           response.status,
//           errorBody?.error?.code || 'HTTP_ERROR',
//           errorBody?.error?.details
//         );
//       }

//       if (isEnvelope) {
//         const apiResponse = body as ApiResponse<T>;

//         if (!apiResponse.success) {
//           throw new ApiError(
//             apiResponse.error?.message || 'Request failed',
//             response.status,
//             apiResponse.error?.code || 'API_ERROR',
//             apiResponse.error?.details
//           );
//         }

//         return apiResponse.data as T;
//       }

//       return body as T;
//     } catch (error) {
//       if (error instanceof ApiError) {
//         throw error;
//       }

//       throw new ApiError(
//         error instanceof Error ? error.message : 'Unknown error',
//         500,
//         'UNKNOWN_ERROR'
//       );
//     }
//   }

//   /**
//    * GET request
//    */
//   async get<T>(endpoint: string): Promise<T> {
//     return this.request<T>(endpoint, 'GET');
//   }

//   /**
//    * POST request
//    */
//   async post<T>(endpoint: string, data: any): Promise<T> {
//     return this.request<T>(endpoint, 'POST', data);
//   }

//   /**
//    * PATCH request
//    */
//   async patch<T>(endpoint: string, data: any): Promise<T> {
//     return this.request<T>(endpoint, 'PATCH', data);
//   }

//   /**
//    * DELETE request
//    */
//   async delete<T>(endpoint: string): Promise<T> {
//     return this.request<T>(endpoint, 'DELETE');
//   }

//   /**
//    * Get with query parameters
//    */
//   async getWithQuery<T>(
//     endpoint: string,
//     params?: Record<string, string | number | boolean | Date>
//   ): Promise<T> {
//     const queryString = params
//       ? `?${new URLSearchParams(
//           Object.entries(params).map(([key, value]) => [key, String(value)])
//         ).toString()}`
//       : '';
//     return this.get<T>(`${endpoint}${queryString}`);
//   }
// }

// /**
//  * Custom API Error class
//  */
// export class ApiError extends Error {
//   constructor(
//     message: string,
//     public statusCode: number = 500,
//     public code: string = 'API_ERROR',
//     public details?: Record<string, any>
//   ) {
//     super(message);
//     this.name = 'ApiError';
//   }
// }

// /**
//  * Response builder for consistent API responses
//  */
// export class ResponseBuilder {
//   /**
//    * Build success response
//    */
//   static success<T>(data: T, meta?: any): ApiResponse<T> {
//     return {
//       success: true,
//       data,
//       meta: {
//         timestamp: new Date().toISOString(),
//         version: 'v1',
//         ...meta,
//       },
//     };
//   }

//   /**
//    * Build error response
//    */
//   static error(
//     message: string,
//     code: string = 'ERROR',
//     statusCode: number = 400,
//     details?: Record<string, any>
//   ): [ApiResponse, number] {
//     return [
//       {
//         success: false,
//         error: {
//           code,
//           message,
//           details,
//         },
//         meta: {
//           timestamp: new Date().toISOString(),
//           version: 'v1',
//         },
//       },
//       statusCode,
//     ];
//   }

//   /**
//    * Build paginated response
//    */
//   static paginated<T>(items: T[], total: number, page: number, pageSize: number): ApiResponse<T[]> {
//     const totalPages = Math.ceil(total / pageSize);
//     return {
//       success: true,
//       data: items,
//       meta: {
//         timestamp: new Date().toISOString(),
//         version: 'v1',
//         pagination: {
//           total,
//           page,
//           pageSize,
//           totalPages,
//         },
//       },
//     };
//   }
// }

// /**
//  * Validation error response builder
//  */
// export class ValidationErrorBuilder {
//   private errors: Record<string, string[]> = {};

//   addError(field: string, message: string): this {
//     if (!this.errors[field]) {
//       this.errors[field] = [];
//     }
//     this.errors[field].push(message);
//     return this;
//   }

//   hasErrors(): boolean {
//     return Object.keys(this.errors).length > 0;
//   }

//   build(): [ApiResponse, number] {
//     return ResponseBuilder.error('Validation failed', 'VALIDATION_ERROR', 422, this.errors);
//   }
// }

// /**
//  * Instance
//  */
// export const apiClient = new ApiClient();

// /**
//  * Usage Examples:
//  *
//  * // GET request
//  * const response = await apiClient.get<User>('/users/123');
//  * if (response.success) {
//  *   console.log(response.data);
//  * }
//  *
//  * // POST request
//  * const createResponse = await apiClient.post<User>('/users', {
//  *   firstName: 'John',
//  *   email: 'john@example.com'
//  * });
//  *
//  * // In API route
//  * export async function POST(req: NextRequest) {
//  *   try {
//  *     const body = await req.json();
//  *     const result = await someService.create(body);
//  *     return NextResponse.json(ResponseBuilder.success(result));
//  *   } catch (error) {
//  *     const [response, status] = ResponseBuilder.error(
//  *       error.message,
//  *       'CREATE_ERROR'
//  *     );
//  *     return NextResponse.json(response, { status });
//  *   }
//  * }
//  *
//  * // In component with error handling
//  * try {
//  *   const response = await apiClient.post('/users', userData);
//  *   if (response.success) {
//  *     console.log('User created:', response.data);
//  *   }
//  * } catch (error) {
//  *   if (error instanceof ApiError) {
//  *     console.error(`Error ${error.statusCode}:`, error.message);
//  *   }
//  * }
//  */
