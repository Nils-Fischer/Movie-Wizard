"use server";

import { getMovieMetadata } from "@/app/actions";
import {
  MovieRecommendation,
  MovieRecommendationSchema,
  MovieRecommendationsSchema,
  OmdbMovieData,
} from "@/lib/movieTypes";
import { createStreamableValue } from "ai/rsc";
import { geminiModel } from "@/lib/gemini";
import { streamObject } from "ai";

export const streamMovieRecommendations = async (searchQuery: string) => {
  const streamableStatus = createStreamableValue<MovieRecommendation[]>([]);

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

  (async () => {
    const { partialObjectStream } = await streamObject({
      model: geminiModel,
      system: systemPrompt,
      prompt: `User query: ${searchQuery}`,
      schema: MovieRecommendationsSchema,
    });

    let recommendations: Map<string, { movie: MovieRecommendation; metadata: OmdbMovieData | undefined | "error" }> =
      new Map();
    const metadataPromises: Promise<void>[] = [];

    for await (const partialObject of partialObjectStream) {
      const movies = partialObject as MovieRecommendation[];

      const newMovies = movies.filter(
        (movie) => MovieRecommendationSchema.safeParse(movie).success && !recommendations.has(movie.title)
      );

      newMovies.forEach((movie) => {
        recommendations.set(movie.title, { movie, metadata: undefined });
      });

      const moviesWithMetadata = movies.map((movie) => ({
        ...movie,
        metadata: recommendations.get(movie.title)?.metadata,
      }));
      streamableStatus.update(moviesWithMetadata);

      newMovies.forEach((movie) => {
        const promise = (async () => {
          console.log(`Fetching metadata for: ${movie.title}`);
          const metadata = await getMovieMetadata(movie.title, movie.year.toString());
          recommendations.set(movie.title, { movie, metadata: metadata ?? "error" });
          console.log(`Metadata fetched for: ${movie.title}`);
        })();
        metadataPromises.push(promise);
      });
    }

    // Wait for all metadata fetches to complete
    await Promise.all(metadataPromises);

    const finalRecommendations = Array.from(recommendations.values()).map(({ movie, metadata }) => {
      return {
        ...movie,
        metadata,
      };
    });
    streamableStatus.done(finalRecommendations);
  })();

  return { value: streamableStatus.value };
};
