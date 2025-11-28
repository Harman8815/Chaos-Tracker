
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';

export const ENDPOINTS = {
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
};

export const REQUEST_TIMEOUT_MS = 5000;
