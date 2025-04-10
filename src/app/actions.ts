"use server";

import { geminiModel } from "@/lib/gemini";
import { generateObject } from "ai";
import { z } from "zod";

// Create a Zod schema for movie recommendations
const MovieRecommendationSchema = z.object({
  title: z.string(),
  year: z.string(),
  genre: z.string(),
  description: z.string(),
});

const MovieRecommendationsSchema = z.array(MovieRecommendationSchema);

export type MovieRecommendation = z.infer<typeof MovieRecommendationSchema>;

export async function getMovieRecommendations(prompt: string): Promise<MovieRecommendation[]> {
  try {
    // Create a system prompt that instructs Gemini to provide movie recommendations
    const systemPrompt = `
      You are a knowledgeable movie recommender. Based on the user's query, 
      recommend exactly 9 movies that match their preferences. 
      Format your answer as a JSON array with objects containing:
      - title: the movie title
      - year: the release year
      - genre: the primary genre
      - description: a brief description (under 100 words)
      
      Only respond with the JSON array, nothing else.
    `;

    // Combine system prompt with user query
    const { object } = await generateObject({
      model: geminiModel,
      system: systemPrompt,
      prompt: `User query: ${prompt}`,
      schema: MovieRecommendationsSchema,
    });

    if (!object || object.length === 0) {
      throw new Error("No recommendations found");
    }

    return object;
  } catch (error) {
    console.error("Error getting movie recommendations:", error);
    return []; // Return empty array on error
  }
}
