import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI SDK
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

// Get the Gemini model
export const geminiModel = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});
