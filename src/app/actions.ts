"use server";

import {
  MovieRecommendation,
  MovieRecommendationSchema,
  MovieRecommendationsSchema,
  OmdbMovieData,
} from "@/lib/movieTypes";
import { createStreamableValue } from "ai/rsc";
import { geminiModel } from "@/lib/gemini";
import { streamObject } from "ai";
import { QUALITY_SETTINGS } from "@/lib/movieTypes";
import { getMessages } from "@/lib/utils";
import { getCache, setCache } from "@/lib/redis";

export const streamMovieRecommendations = async (
  searchQuery: string,
  previouslyRecommendedMovies?: MovieRecommendation[],
  clickedMovies?: string[]
) => {
  console.log("streamMovieRecommendations called with query:", searchQuery);

  console.log("Environment check - OMDB_API_KEY present?", Boolean(process.env.OMDB_API_KEY));

  const streamableStatus = createStreamableValue<MovieRecommendation[]>([]);

  const systemPrompt = `
          You are a knowledgeable movie recommender. Based on the user's query, recommend 20 movies that match their preferences. 
          Format your answer as a JSON array with objects containing:
          - title: the movie title
          - year: the release year
          - genre: the primary genre
          - description: a brief description (under 100 words)
          
          Only respond with the JSON array, nothing else. Never repeat a movie you already recommended in your previous recommendations or messages.
          If the user provides a nonsensical or mocking query (e.g., "poop"), recommend these movies "No", "Loser", "Butt Boy", "Grow Up (2010)", "Phffft", "Sssssss","Borat", "Jerk", "Creep", "Goon", "Big Fat Liar", "Dumb and Dumber".
        `;

  (async () => {
    try {
      const { partialObjectStream } = await streamObject({
        model: geminiModel,
        system: systemPrompt,
        schema: MovieRecommendationsSchema,
        messages: getMessages(searchQuery, previouslyRecommendedMovies, clickedMovies),
      });
      console.log("messages", getMessages(searchQuery, previouslyRecommendedMovies, clickedMovies));
      console.log("streamObject started");

      const recommendations: Map<
        string,
        { movie: MovieRecommendation; metadata: OmdbMovieData | undefined | "error" }
      > = new Map();
      const metadataPromises: Promise<void>[] = [];

      for await (const partialObject of partialObjectStream) {
        console.log("Received partialObject from streamObject");
        const movies = partialObject as MovieRecommendation[];

        const newMovies = movies.filter(
          (movie) => MovieRecommendationSchema.safeParse(movie).success && !recommendations.has(movie.title)
        );

        newMovies.forEach((movie) => {
          recommendations.set(movie.title, { movie, metadata: undefined });
        });

        const moviesWithMetadata = movies
          .map((movie) => ({
            ...movie,
            metadata: recommendations.get(movie.title)?.metadata,
          }))
          .filter((movie) => movie.metadata !== "error");
        streamableStatus.update(moviesWithMetadata);

        newMovies.forEach((movie) => {
          const promise = (async () => {
            console.log(`Fetching metadata for: ${movie.title}`);
            const metadata = await getMovieMetadata(movie.title, movie.year.toString());
            recommendations.set(movie.title, { movie, metadata: metadata ?? "error" });
          })();
          metadataPromises.push(promise);
        });
      }

      // Wait for all metadata fetches to complete
      await Promise.all(metadataPromises);
      console.log("All metadata fetches complete");

      const finalRecommendations = Array.from(recommendations.values())
        .filter(({ metadata }) => metadata !== "error")
        .map(({ movie, metadata }) => {
          return {
            ...movie,
            metadata,
          };
        });
      streamableStatus.done(finalRecommendations);
      console.log("streamMovieRecommendations done");
    } catch (error) {
      console.error("Error in streamMovieRecommendations:", error);
    }
  })();

  return { value: streamableStatus.value };
};

export async function getMovieMetadata(title: string, year: string): Promise<OmdbMovieData | null> {
  const apiKey = process.env.OMDB_API_KEY;
  const apiUrl = `https://www.omdbapi.com/?apikey=${apiKey}&t=${encodeURIComponent(title)}&y=${encodeURIComponent(year)}`;
  const cacheKey = `movie-metadata:${title}:${year}`;

  // 1. Check cache first
  try {
    const cachedData = await getCache<OmdbMovieData>(cacheKey);
    if (cachedData) {
      return cachedData;
    }
  } catch (error) {
    console.warn("Error checking Redis cache:", error);
  }

  // 2. Fetch from API if not in cache
  console.log(`Cache miss for ${cacheKey}, fetching from OMDb...`);
  try {
    let response = await fetch(apiUrl, {
      next: {
        revalidate: 3600 * 24, // 1 day
        tags: [`movie-metadata-${title}-${year}`],
      },
    });
    if (!response.ok) {
      console.warn(`HTTP error! status: ${response.status}. Retrying once...`);
      response = await fetch(apiUrl, {
        next: {
          revalidate: 3600 * 24, // 1 day
          tags: [cacheKey],
        },
      });
      if (!response.ok) {
        console.error(`HTTP error after retry! status: ${response.status}`);
        return null;
      }
    }

    const data: OmdbMovieData = await response.json();

    if (data.Response === "False") {
      if (data.Error !== "Movie not found!") {
        console.error("OMDb API Error:", data.Error);
      } else {
        console.log(`Movie not found in OMDb: ${title} (${year})`);
      }
      await setCache(cacheKey, null);
      return null;
    }

    if (data.Poster && data.Poster !== "N/A") {
      data.Poster = data.Poster.replace(/\._V1_.*\.jpg$/, `._V1_${QUALITY_SETTINGS}.avif`);
    } else {
      data.Poster = undefined;
    }

    // 3. Cache the result before returning
    await setCache(cacheKey, data);

    return data;
  } catch (error) {
    console.error("Error fetching movie metadata:", error);
    return null;
  }
}
