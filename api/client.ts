
import { API_BASE_URL, REQUEST_TIMEOUT_MS } from './constants';

class ApiClient {
    private baseURL: string;

    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }

    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

        const config: RequestInit = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            signal: controller.signal
        };

        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, config);
            clearTimeout(id);

            if (!response.ok) {
                throw new Error(`API call failed: ${response.status} ${response.statusText}`);
            }
            
            // Handle 204 No Content or empty responses gracefully
            const text = await response.text();
            return text ? JSON.parse(text) : {} as T;
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

    delete<T>(endpoint: string, headers?: Record<string, string>) {
        return this.request<T>(endpoint, { method: 'DELETE', headers });
    }
}

export const client = new ApiClient(API_BASE_URL);
