export const WS_BASE_URL: string = (typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_WS_BASE_URL : undefined) || '';

export const POLL_INTERVAL_MS: number = Number(
  (typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_POLL_INTERVAL_MS : undefined) || 30000,
);

export const WS_PATHS = {
  dashboard: '/ws/dashboard/',
  aiStream: '/ws/ai/stream/',
};

export const DEFAULT_POLL_INTERVAL_MS = 30000;
export const FAST_POLL_INTERVAL_MS = 8000;
