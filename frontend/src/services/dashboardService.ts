import { pointsService } from './pointsService';
import { Habit, AllData, DailyData } from '../types';
import { client } from '../api/client';

export interface DashboardData {
    habits: Habit[];
    dailyScores: AllData;
}

/**
 * Dashboard service that aggregates data from existing APIs
 * Uses pointsService for habits and scores
 */
export const dashboardService = {
    /**
     * Get all dashboard data by combining multiple API calls
     * This replaces the sync endpoint for the dashboard
     */
    async getDashboardData(): Promise<DashboardData> {
        try {
            // Fetch habits and scores in parallel
            const [habits, scores] = await Promise.all([
                pointsService.getHabits(),
                pointsService.getScores(), // Get all scores without date filter
            ]);

            // Transform scores array into the AllData format expected by Dashboard
            const dailyScores: AllData = {};
            
            scores.forEach(score => {
                const date = score.date;
                if (!dailyScores[date]) {
                    dailyScores[date] = {
                        journal: '',
                        habitScores: {}
                    };
                }
                dailyScores[date].habitScores![score.habit_id] = score.score;
            });

            return {
                habits,
                dailyScores
            };
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            throw error;
        }
    },

    /**
     * Get dashboard data for a specific date range
     * Useful for optimizing data loading
     */
    async getDashboardDataByDateRange(startDate: string, endDate: string): Promise<DashboardData> {
        try {
            const [habits, scores] = await Promise.all([
                pointsService.getHabits(),
                pointsService.getScores(startDate, endDate),
            ]);

            const dailyScores: AllData = {};
            
            scores.forEach(score => {
                const date = score.date;
                if (!dailyScores[date]) {
                    dailyScores[date] = {
                        journal: '',
                        habitScores: {}
                    };
                }
                dailyScores[date].habitScores![score.habit_id] = score.score;
            });

            return {
                habits,
                dailyScores
            };
        } catch (error) {
            console.error('Error fetching dashboard data by date range:', error);
            throw error;
        }
    },

    /**
     * Get dashboard data for the last N days
     * Optimized for dashboard initial load
     */
    async getRecentDashboardData(days: number = 90): Promise<DashboardData> {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const startDateStr = startDate.toISOString().split('T')[0];
        const endDateStr = endDate.toISOString().split('T')[0];

        return this.getDashboardDataByDateRange(startDateStr, endDateStr);
    },

    // Analytics endpoints
    async getStreaks(): Promise<any> {
        try {
            const res = await client.get('/points/analytics/streaks/');
            return res;
        } catch (error) {
            console.error('Error fetching streaks:', error);
            throw error;
        }
    },

    async getTodayDistribution(): Promise<any> {
        try {
            const res = await client.get('/points/analytics/today-distribution/');
            return res;
        } catch (error) {
            console.error('Error fetching today distribution:', error);
            throw error;
        }
    },

    async getHabitPerformance7(habitId?: string): Promise<any> {
        try {
            const url = habitId ? `/points/analytics/habit-performance/7/?habit_id=${habitId}` : '/points/analytics/habit-performance/7/';
            const res = await client.get(url);
            return res;
        } catch (error) {
            console.error('Error fetching 7-day habit performance:', error);
            throw error;
        }
    },

    async getHabitTrend30(params?: { habitId?: string; startDate?: string; endDate?: string; minScore?: number }): Promise<any> {
        try {
            const query = new URLSearchParams();
            if (params?.habitId) query.append('habit_id', params.habitId);
            if (params?.startDate) query.append('start_date', params.startDate);
            if (params?.endDate) query.append('end_date', params.endDate);
            if (typeof params?.minScore === 'number') query.append('min_score', String(params.minScore));

            const url = '/points/analytics/habit-trend/30/' + (query.toString() ? `?${query.toString()}` : '');
            const res = await client.get(url);
            return res;
        } catch (error) {
            console.error('Error fetching 30-day habit trend:', error);
            throw error;
        }
    }
};
