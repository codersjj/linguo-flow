import { GoogleGenAI } from "@google/genai";

// Note: In a real production app, never expose API keys in frontend code.
// This should be proxied through a backend.
// For this demo, we assume the key is available or the user enters it.

export const getAIExplanation = async (text: string, context: string): Promise<string> => {
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
      Context: An English learning course transcript.
      Target Text: "${text}"
      Surrounding Context: "${context.substring(0, 150)}..."
      
      Task: Explain the meaning of the target text in simple English. 
      If it's a phrase, explain the idiom. 
      If it's a word, give a definition and a synonym.
      Keep it concise (max 50 words).
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Sorry, I couldn't generate an explanation.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error connecting to AI tutor. Please try again later.";
  }
};
