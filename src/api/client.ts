/**
 * PAIMANA PREDICT — CENTRALIZED REST API CLIENT
 * Handles authentication headers, base URLs, error normalization, and typed responses.
 */

export interface ApiResponse<T = any> {
  data: T;
  meta?: any;
  error: {
    code: string;
    message: string;
    statusCode?: number;
  } | null;
}

const API_BASE_URL = '/api/v1';
const TOKEN_STORAGE_KEY = 'paimana_auth_token';

class ApiClient {
  private getToken(): string | null {
    try {
      return localStorage.getItem(TOKEN_STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  public setToken(token: string) {
    try {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } catch (e) {}
  }

  public clearToken() {
    try {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    } catch (e) {}
  }

  public async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
    const token = this.getToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const json = await response.json().catch(() => ({}));

      if (!response.ok) {
        return {
          data: null as any,
          meta: null,
          error: {
            code: json?.error?.code || response.statusText || 'REQUEST_FAILED',
            message: json?.error?.message || json?.error || `HTTP error ${response.status}`,
            statusCode: response.status,
          },
        };
      }

      // If backend returned data wrapped in { data, meta, error }
      if (json && ('data' in json || 'error' in json)) {
        return json;
      }

      // Return raw json as data envelope
      return {
        data: json,
        meta: null,
        error: null,
      };
    } catch (err: any) {
      return {
        data: null as any,
        meta: null,
        error: {
          code: 'NETWORK_ERROR',
          message: err.message || 'Network request failed',
        },
      };
    }
  }

  public async get<T = any>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    let url = endpoint;
    if (params) {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          query.append(key, String(val));
        }
      });
      const qStr = query.toString();
      if (qStr) url += `?${qStr}`;
    }
    return this.request<T>(url, { method: 'GET' });
  }

  public async post<T = any>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public async patch<T = any>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }
}

export const apiClient = new ApiClient();
