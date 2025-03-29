import { createGoogleGenerativeAI } from "@ai-sdk/google";
// Initialize the Google Generative AI SDK
const genAI = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY || "",
});

// Get the Gemini model
export const geminiModel = genAI("gemini-2.0-flash");
