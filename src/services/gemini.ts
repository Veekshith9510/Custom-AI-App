import { GoogleGenAI, Type } from "@google/genai";
import { AgendaItem } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateAgendaFromText(text: string): Promise<{ title: string; items: Omit<AgendaItem, 'id'>[] }> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze the following document and create a structured meeting agenda. 
    Extract key topics, provide a concise summary for each, identify action items and stakeholders, 
    and suggest a percentage of the total meeting time for each topic (total must sum to 100).
    
    Document Content:
    ${text}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "A catchy title for the meeting" },
          items: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                summary: { type: Type.STRING },
                actionItems: { type: Type.ARRAY, items: { type: Type.STRING } },
                stakeholders: { type: Type.ARRAY, items: { type: Type.STRING } },
                suggestedPercentage: { type: Type.NUMBER, description: "Percentage of total time (0-100)" }
              },
              required: ["title", "summary", "actionItems", "stakeholders", "suggestedPercentage"]
            }
          }
        },
        required: ["title", "items"]
      }
    }
  });

  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    throw new Error("Failed to generate agenda. Please try again.");
  }
}
