
// Use process.env.API_KEY directly in constructors and removed unused Type
import { GoogleGenAI, Chat } from "@google/genai";

export const getAIGuidance = async (projectDetails: string) => {
  // Always use a new instance with the direct process.env.API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `As an expert advisor for Decensat C3 project management, analyze these project details and provide a professional 3-sentence guidance note on how to manage the treasury and milestones effectively: ${projectDetails}`,
    config: {
      temperature: 0.7,
      topK: 40,
    }
  });
  return response.text;
};

export const generateTermsSummary = async () => {
  // Always use a new instance with the direct process.env.API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: "Create a short, reassuring 3-point summary of standard terms and conditions for Decensat, a high-stakes Web3 treasury and escrow platform. Make it sound professional and secure.",
  });
  return response.text;
};

export const createAIChat = (projectContext: string): Chat => {
  // Always use a new instance with the direct process.env.API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `You are the Sovereign Guidance AI for the Decensat C3 Portal. 
      You help clients manage high-value blockchain project treasuries for Decensat projects. 
      Context: ${projectContext}. 
      Always provide professional, risk-aware, and actionable advice. 
      Keep answers concise and expert-level.`,
    },
  });
};
