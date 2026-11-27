export interface ApiResponse<T = unknown> { success: boolean; data?: T; error?: { code: string; message: string; details?: Record<string, unknown> }; }
export type QueryParamValue = string | number | boolean | Date | null | undefined;
export type QueryParams = Record<string, QueryParamValue>;

let accessToken: string | null = null;
let refreshing: Promise<string | null> | null = null;
const authKind = "admin" as const;
const authRoot = "/auth-admin";

export function setAccessToken(token: string | null) { accessToken = token; }
export function getAccessToken() { return accessToken; }

export class ApiError extends Error {
  constructor(message: string, public statusCode = 500, public code = "API_ERROR", public details?: Record<string, unknown>) { super(message); this.name = "ApiError"; }
}

export class ApiClient {
  private baseUrl: string;
  private timeout = 30000;
  constructor(baseUrl: string = import.meta.env.VITE_API_BASE_URL || "") {
    this.baseUrl = baseUrl.replace(/\/$/, "").replace(/\/api\/v1$/, "");
  }
  private url(endpoint: string, params?: QueryParams) {
    const path = endpoint.startsWith("/api/v1/") ? endpoint : `/api/v1${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
    const url = new URL(`${this.baseUrl}${path}`, window.location.origin);
    Object.entries(params ?? {}).forEach(([key, value]) => { if (value !== undefined && value !== null && value !== "") url.searchParams.set(key, value instanceof Date ? value.toISOString() : String(value)); });
    return url.toString();
  }
  private async refresh(): Promise<string | null> {
    if (refreshing) return refreshing;
    refreshing = (async () => {
      try {
        const response = await fetch(this.url(`${authRoot}/refresh`), { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" } });
        if (!response.ok) { accessToken = null; return null; }
        const data = await response.json() as { access_token?: string };
        accessToken = data.access_token ?? null;
        return accessToken;
      } catch { accessToken = null; return null; }
      finally { refreshing = null; }
    })();
    return refreshing;
  }
  async refreshSession() { return this.refresh(); }
  private async request<T>(endpoint: string, method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE" = "GET", data?: unknown, params?: QueryParams): Promise<T> {
    const url = this.url(endpoint, params);
    const execute = () => {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
      const init: RequestInit = { method, credentials: "include", headers, signal: AbortSignal.timeout(this.timeout) };
      if (data !== undefined && method !== "GET") init.body = JSON.stringify(data);
      return fetch(url, init);
    };
    let response = await execute();
    const isAuthRequest = endpoint.includes("/auth-admin/login") || endpoint.includes("/auth-admin/refresh");
    if (response.status === 401 && !isAuthRequest) {
      const token = await this.refresh();
      if (token) response = await execute();
    }
    if (response.status === 204) return undefined as T;
    const contentType = response.headers.get("content-type");
    const body = contentType?.includes("application/json") ? await response.json() as ApiResponse<T> | T : undefined;
    if (!response.ok) {
      const obj = body && typeof body === "object" ? body as Record<string, unknown> : {};
      const error = obj.error && typeof obj.error === "object" ? obj.error as Record<string, unknown> : {};
      const message = typeof error.message === "string" ? error.message : typeof obj.detail === "string" ? obj.detail : typeof obj.message === "string" ? obj.message : response.statusText || `HTTP ${response.status}`;
      throw new ApiError(message, response.status, typeof error.code === "string" ? error.code : "HTTP_ERROR", error.details as Record<string, unknown> | undefined);
    }
    if (body && typeof body === "object" && "success" in body) {
      const envelope = body as ApiResponse<T>;
      if (!envelope.success) throw new ApiError(envelope.error?.message || "Request failed", response.status, envelope.error?.code || "API_ERROR", envelope.error?.details);
      return envelope.data as T;
    }
    return body as T;
  }
  get<T>(endpoint: string, params?: QueryParams) { return this.request<T>(endpoint, "GET", undefined, params); }
  post<T>(endpoint: string, data?: unknown, params?: QueryParams) { return this.request<T>(endpoint, "POST", data, params); }
  patch<T>(endpoint: string, data?: unknown, params?: QueryParams) { return this.request<T>(endpoint, "PATCH", data, params); }
  put<T>(endpoint: string, data?: unknown, params?: QueryParams) { return this.request<T>(endpoint, "PUT", data, params); }
  delete<T>(endpoint: string, params?: QueryParams) { return this.request<T>(endpoint, "DELETE", undefined, params); }
  getWithQuery<T>(endpoint: string, params?: QueryParams) { return this.get<T>(endpoint, params); }
}
export const apiClient = new ApiClient();
