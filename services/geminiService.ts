
import { GoogleGenAI } from "@google/genai";
import type { DailyData } from '../types';

export const getDailyReflection = async (data: DailyData): Promise<string> => {
  if (!process.env.API_KEY) {
    return "API Key not found. Please set the API_KEY environment variable.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const completedHabits = data.habits?.filter(h => h.completed).map(h => h.name).join(', ') || 'None';
    
    const prompt = `
      Based on my daily tracking data below, please provide a short, encouraging, and insightful reflection (max 3-4 sentences). 
      Be positive but realistic.

      - Mood: ${data.mood || 'Not tracked'}
      - Completed Habits: ${completedHabits}
      - Journal Entry: "${data.journal || 'No entry.'}"

      Generate the reflection now.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text;

  } catch (error) {
    console.error("Error generating reflection:", error);
    return "Sorry, I couldn't generate a reflection at this time. Please try again later.";
  }
};
