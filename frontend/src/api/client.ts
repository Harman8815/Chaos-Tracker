
import { API_BASE_URL, REQUEST_TIMEOUT_MS } from './constants';

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

