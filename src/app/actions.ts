"server-only";

import { geminiModel } from "@/lib/gemini";
import { generateObject } from "ai";
import { unstable_cache as cache } from "next/cache";
import { MovieRecommendation, OmdbMovieData, MovieRecommendationsSchema } from "@/lib/movieTypes";

export const getMovieRecommendations = cache(
  async (prompt: string): Promise<MovieRecommendation[] | null> => {
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
      console.error("No recommendations found");
      return [];
    }

    return object;
  },
  ["movie-recommendations"]
);

export async function getMovieMetadata(title: string, year: string): Promise<OmdbMovieData | null> {
  const apiKey = process.env.OMDB_API_KEY;
  const apiUrl = `https://www.omdbapi.com/?apikey=${apiKey}&t=${encodeURIComponent(title)}&y=${encodeURIComponent(year)}`;

  try {
    const response = await fetch(apiUrl, {
      next: {
        revalidate: 3600, // 1 hour
        tags: [`movie-metadata-${title}-${year}`],
      },
    });
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      return null;
    }

    const data: OmdbMovieData = await response.json();
    // Replace the size specifier like ._V1_SX300 with an empty string to get the original image
    data.Poster = data.Poster.replace(/\._V1_SX\d+/, "");

    if (data.Response === "False") {
      console.error("OMDb API Error:", data.Error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error fetching movie metadata:", error);
    return null;
  }
}
