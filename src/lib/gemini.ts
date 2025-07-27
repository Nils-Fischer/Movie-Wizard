import { createGoogleGenerativeAI } from "@ai-sdk/google";

// Initialize the Google Generative AI SDK
const apiKey = process.env.GOOGLE_API_KEY || "";
if (!apiKey) {
  console.warn("Warning: GOOGLE_API_KEY is not set. Gemini model will not work without it.");
}
const genAI = createGoogleGenerativeAI({
  apiKey,
});

// Get the Gemini model
export const geminiModel = genAI("gemini-2.5-flash");
