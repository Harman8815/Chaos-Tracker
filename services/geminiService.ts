import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
// FIX: Corrected import path for types.
import { AllData } from "../types";

const getYesterdayDate = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0];
}

export const getAIPoweredSummary = async (data: AllData): Promise<string> => {
    const yesterday = getYesterdayDate();
    const yesterdayData = data[yesterday];

    if (!yesterdayData) {
        return "Not enough data from yesterday to generate a reflection. Keep tracking your progress!";
    }
    
    // FIX: Added a check for yesterdayData.habits to prevent runtime errors if it's undefined.
    const completedHabits = (yesterdayData.habits || []).filter(h => h.completed).map(h => h.name).join(', ') || 'None';

    const prompt = `
        Based on the user's tracking data from yesterday, provide a short, encouraging reflection.
        - Completed Habits: ${completedHabits}
        - Daily Score (out of 10): ${yesterdayData.points}
        - Journal Entry: "${yesterdayData.journal}"

        Keep the reflection positive and under 50 words.
    `;
    
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating AI summary:", error);
        return "Could not generate AI reflection at this time. Keep up the great work!";
    }
};