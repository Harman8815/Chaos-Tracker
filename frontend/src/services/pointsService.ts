import { client } from '../api/client';
import { ENDPOINTS } from '../api/constants';
import { Habit, ScoringRule } from '../types';

export interface DailyScoreResponse {
    date: string;
    habit_id: string;
    score: number;
}

export interface PointsData {
    habits: Habit[];
    rules: ScoringRule[];
    dailyData: {
        [date: string]: {
            habitScores: { [habitId: string]: number };
            journal: string;
        }
    };
}

export const pointsService = {
    // Consolidated Data
    async getPointsData(): Promise<PointsData> {
        const response = await client.get<PointsData>('/points/data/');
        return response;
    },

    // Habits
    async getHabits(): Promise<Habit[]> {
        const response = await client.get<Habit[]>('/points/habits/');
        return response;
    },

    async createHabit(habit: Partial<Habit>): Promise<Habit> {
        const response = await client.post<Habit>('/points/habits/', habit);
        return response;
    },

    async updateHabit(id: string, habit: Partial<Habit>): Promise<Habit> {
        const response = await client.put<Habit>(`/points/habits/${id}/`, habit);
        return response;
    },

    async deleteHabit(id: string): Promise<void> {
        await client.delete(`/points/habits/${id}/`);
    },

    // Scoring Rules
    async getRules(): Promise<ScoringRule[]> {
        const response = await client.get<ScoringRule[]>('/points/rules/');
        return response;
    },

    async createRule(rule: Partial<ScoringRule>): Promise<ScoringRule> {
        const response = await client.post<ScoringRule>('/points/rules/', rule);
        return response;
    },

    async updateRule(id: string, rule: Partial<ScoringRule>): Promise<ScoringRule> {
        const response = await client.put<ScoringRule>(`/points/rules/${id}/`, rule);
        return response;
    },

    async deleteRule(id: string): Promise<void> {
        await client.delete(`/points/rules/${id}/`);
    },

    // Scores
    async getScores(startDate?: string, endDate?: string): Promise<DailyScoreResponse[]> {
        let url = '/points/scores/';
        const params = new URLSearchParams();
        if (startDate) params.append('start_date', startDate);
        if (endDate) params.append('end_date', endDate);
        
        if (params.toString()) {
            url += `?${params.toString()}`;
        }
        
        const response = await client.get<DailyScoreResponse[]>(url);
        return response;
    },

    async updateScore(date: string, habitId: string, score: number): Promise<DailyScoreResponse> {
        const response = await client.post<DailyScoreResponse>('/points/scores/', {
            date,
            habit_id: habitId,
            score
        });
        return response;
    }
};
