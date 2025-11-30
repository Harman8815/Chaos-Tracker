// Django backend base URL
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

export const ENDPOINTS = {
    // Authentication endpoints
    SIGNUP: '/auth/signup/',
    LOGIN: '/auth/login/',
    LOGOUT: '/auth/logout/',
    ME: '/auth/me/',
    
    // Application endpoints
    SYNC: '/sync',
    USER_PROFILE: '/user/profile',
    HABITS: '/habits',
    DATA: '/data',
    PLANNER: '/planner',
    GOALS: '/goals',
    EXPENSES: '/expenses',
    QUOTES: '/quotes',
    ACHIEVEMENTS: '/achievements',
    RULES: '/rules',
    JOURNAL: '/journal/',
};

export const REQUEST_TIMEOUT_MS = 10000;
