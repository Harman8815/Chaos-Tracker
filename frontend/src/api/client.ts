
import { API_BASE_URL, REQUEST_TIMEOUT_MS } from './constants';

/**
 * Emitted by the ApiClient when the server responds with 401 Unauthorized.
 * Subscribers (e.g. the auth provider) can listen and redirect to login.
 */
export const UNAUTHENTICATED_EVENT = 'api:unauthenticated';
type UnauthListener = () => void;
const listeners: UnauthListener[] = [];
export function onUnauthenticated(fn: UnauthListener): () => void {
    listeners.push(fn);
    return () => {
        const idx = listeners.indexOf(fn);
        if (idx >= 0) listeners.splice(idx, 1);
    };
}
export function emitUnauthenticated(): void {
    listeners.forEach(fn => {
        try {
            fn();
        } catch {
            // ignore listener errors
        }
    });
}

class ApiClient {
    private baseURL: string;

    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }

    private getCookie(name: string): string | null {
        if (typeof document === 'undefined') return null;
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
        return null;
    }

    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

        const csrfToken = this.getCookie('csrftoken');

        const config: RequestInit = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(csrfToken && { 'X-CSRFToken': csrfToken }),
                ...options.headers,
            },
            credentials: 'include', // Important for session-based auth with Django
            signal: controller.signal
        };

        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, config);
            clearTimeout(id);

            if (response.status === 401) {
                // Token/session missing or expired: force re-auth.
                emitUnauthenticated();
                const error = new Error('Authentication required. Please log in again.') as any;
                error.code = 'UNAUTHENTICATED';
                error.status = 401;
                throw error;
            }

            if (!response.ok) {
                const text = await response.text();
                let errorMessage = `API call failed: ${response.status} ${response.statusText}`;

                try {
                    const errorData = JSON.parse(text);
                    if (errorData.error && typeof errorData.error === 'object') {
                        errorMessage = errorData.error.message || errorData.message || errorMessage;
                        const apiError = new Error(errorMessage) as any;
                        apiError.code = errorData.error.code;
                        apiError.details = errorData.error.details;
                        throw apiError;
                    }
                    errorMessage = errorData.error || errorData.message || errorMessage;
                    const apiError = new Error(errorMessage) as any;
                    apiError.code = errorData.code;
                    apiError.details = errorData.details;
                    throw apiError;
                } catch {
                    throw new Error(errorMessage);
                }
            }

            const text = await response.text();
            if (!text) return {} as T;

            const parsed = JSON.parse(text);

            if (parsed && typeof parsed === 'object') {
                if (parsed.success === true && 'data' in parsed) {
                    return parsed.data as T;
                }
                if (parsed.success === false) {
                    const apiError = new Error(parsed.error || 'API request failed') as any;
                    apiError.code = parsed.code;
                    apiError.details = parsed.details;
                    throw apiError;
                }
            }

            return parsed as T;
        } catch (error) {
            clearTimeout(id);
            // Re-throw to be handled by service layer
            throw error;
        }
    }

    get<T>(endpoint: string, headers?: Record<string, string>) {
        return this.request<T>(endpoint, { method: 'GET', headers });
    }

    post<T>(endpoint: string, data: any, headers?: Record<string, string>) {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
            headers
        });
    }

    put<T>(endpoint: string, data: any, headers?: Record<string, string>) {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers
        });
    }

    patch<T>(endpoint: string, data: any, headers?: Record<string, string>) {
        return this.request<T>(endpoint, {
            method: 'PATCH',
            body: JSON.stringify(data),
            headers
        });
    }

    delete<T>(endpoint: string, headers?: Record<string, string>) {
        return this.request<T>(endpoint, { method: 'DELETE', headers });
    }

    postFormData<T>(endpoint: string, formData: FormData, headers?: Record<string, string>) {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: formData,
            headers
        });
    }
}

export const client = new ApiClient(API_BASE_URL);

