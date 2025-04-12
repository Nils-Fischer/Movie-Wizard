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

export interface OmdbMovieData {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string; // URL
  Ratings: Array<{ Source: string; Value: string }>;
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string; // e.g., 'movie', 'series'
  DVD?: string; // Optional fields
  BoxOffice?: string;
  Production?: string;
  Website?: string;
  Response: "True" | "False";
  Error?: string; // Present if Response is "False"
}

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

// Function to fetch movie metadata from OMDb API
export async function getMovieMetadata(title: string, year: string): Promise<OmdbMovieData | null> {
  const apiKey = process.env.OMDB_API_KEY;
  const apiUrl = `https://www.omdbapi.com/?apikey=${apiKey}&t=${encodeURIComponent(title)}&y=${encodeURIComponent(year)}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: OmdbMovieData = await response.json();
    // Replace the size specifier like ._V1_SX300 with an empty string to get the original image
    data.Poster = data.Poster.replace(/\._V1_SX\d+/, "");

    if (data.Response === "False") {
      console.error("OMDb API Error:", data.Error);
      return null; // Movie not found or other API error
    }

    return data;
  } catch (error) {
    console.error("Error fetching movie metadata:", error);
    return null; // Return null on fetch error
  }
}
