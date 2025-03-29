"use server";

import { geminiModel } from "@/lib/gemini";

export interface MovieRecommendation {
  title: string;
  year: string;
  genre: string;
  description: string;
}

export async function getMovieRecommendations(prompt: string): Promise<MovieRecommendation[]> {
  try {
    // Create a system prompt that instructs Gemini to provide movie recommendations
    const systemPrompt = `
      You are a knowledgeable movie recommender. Based on the user's query, 
      recommend 5 movies that match their preferences. 
      Format your answer as a JSON array with objects containing:
      - title: the movie title
      - year: the release year
      - genre: the primary genre
      - description: a brief description (under 100 words)
      
      Only respond with the JSON array, nothing else.
    `;

    // Combine system prompt with user query
    const result = await geminiModel.generateContent([systemPrompt, `User query: ${prompt}`]);

    const text = result.response.text();

    // Extract JSON from the response
    const jsonStr = text.replace(/```json|```/g, "").trim();

    // Parse the JSON
    const recommendations = JSON.parse(jsonStr) as MovieRecommendation[];

    return recommendations.slice(0, 5); // Ensure we only return max 5 recommendations
  } catch (error) {
    console.error("Error getting movie recommendations:", error);
    return []; // Return empty array on error
  }
}
