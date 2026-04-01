import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
// FIX: Corrected import path for types.
import { AllData, Habit } from "../types";

const getYesterdayDate = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0];
}

export const getAIPoweredSummary = async (data: AllData, habits: Habit[]): Promise<string> => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = getYesterdayDate();
    const yesterdayData = data[yesterday];

    if (!yesterdayData) {
        return "Not enough data from yesterday to generate a reflection. Keep tracking your progress!";
    }
    
    const yesterdayScores = habits.map(h => `- ${h.name}: ${yesterdayData.habitScores?.[h.id] || 0}/${h.rangeMax || 10}`).join('\n');

    const currentDate = new Date(today);
    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const daysPassed = currentDate.getDate();

    const monthlyProgress = habits.map(habit => {
        const monthData = Object.entries(data).filter(([date]) => {
            const d = new Date(date);
            return d.getFullYear() === currentDate.getFullYear() && d.getMonth() === currentDate.getMonth();
        });
        const totalScore = monthData.reduce((sum, [, dayData]) => sum + (dayData.habitScores?.[habit.id] || 0), 0);
        const onTrackScore = (habit.target / daysInMonth) * daysPassed;

        // FIX: Corrected variable from 'h' to 'habit' to resolve reference error.
        return `- ${habit.name}: Current Total: ${totalScore}, Monthly Target: ${habit.target}. (On track to hit: ${(totalScore / daysPassed * daysInMonth).toFixed(0)})`;
    }).join('\n');


    const prompt = `
        You are a motivational coach. Based on my tracking data, provide a structured reflection.

        **Yesterday's Review (${yesterday}):**
        Scores:
        ${yesterdayScores}
        Journal: "${yesterdayData.journal || 'No entry.'}"

        **Monthly Target Analysis (as of ${today}):**
        ${monthlyProgress}

        **Your Reflection & Action Plan (be concise and direct):**
        1.  **What went wrong yesterday?** Briefly analyze habits with low scores.
        2.  **How can I improve tomorrow?** Offer 2-3 concrete, actionable tips.
        3.  **How can I meet my monthly targets?** Give strategic advice for habits that are behind schedule.
    `;
    
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text || "Could not generate AI reflection at this time. Keep up the great work!";
    } catch (error) {
        console.error("Error generating AI summary:", error);
        return "Could not generate AI reflection at this time. Keep up the great work!";
    }
};