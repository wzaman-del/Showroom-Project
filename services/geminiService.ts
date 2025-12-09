import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateMarketingCopy = async (make: string, model: string, year: number): Promise<string> => {
  if (!apiKey) {
    console.warn("No API Key provided for Gemini");
    return "Experience the pinnacle of automotive excellence. (AI Key missing)";
  }

  try {
    const prompt = `Write a short, sophisticated, and luxurious sales description for a ${year} ${make} ${model}. 
    Focus on emotion, prestige, and engineering. 
    Maximum 2 sentences. 
    Do not use exclamation marks. 
    Tone: Elegant, Exclusive, Gold-standard.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "A vehicle beyond compare.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return `The definitive ${year} ${make} ${model}. A class of its own.`;
  }
};
