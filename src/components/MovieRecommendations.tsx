"use server";

import { getMovieMetadata } from "@/app/actions";
import { MovieCard } from "./MovieCard";
import {
  MovieRecommendation,
  MovieRecommendationSchema,
  MovieRecommendationsSchema,
  OmdbMovieData,
} from "@/lib/movieTypes";
import { createStreamableUI } from "ai/rsc";
import { geminiModel } from "@/lib/gemini";
import { streamObject } from "ai";
import React, { Suspense } from "react";
import { Loader2 } from "lucide-react";

export async function streamMovieRecommendationsUI(searchQuery: string): Promise<React.ReactNode> {
  console.log("searchQuery", searchQuery);
  if (!searchQuery || searchQuery.trim() === "") {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground text-lg">Enter a search query to get movie recommendations</p>
      </div>
    );
  }

  const uiStream = createStreamableUI(<Loader2 className="h-10 w-10 animate-spin" />);

  let movieRecommendations: Set<string> = new Set();

  (async () => {
    try {
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

      const { partialObjectStream } = await streamObject({
        model: geminiModel,
        system: systemPrompt,
        prompt: `User query: ${searchQuery}`,
        schema: MovieRecommendationsSchema,
      });

      for await (const partialObject of partialObjectStream) {
        console.log("partialObject", partialObject);

        partialObject.forEach((movie) => {
          const { success, data } = MovieRecommendationSchema.safeParse(movie);
          if (success && !movieRecommendations.has(data.title)) {
            movieRecommendations.add(data.title);
            if (movieRecommendations.size === 1) {
              uiStream.update(<MovieCard movie={data} />);
            } else {
              uiStream.append(<MovieCard movie={data} />);
            }
          }
        });
      }

      uiStream.done();
    } catch (error) {
      console.error("Error streaming movie recommendations UI:", error);
      uiStream.error(<div>Error loading recommendations.</div>);
    }
  })();

  return uiStream.value;
}
export async function MovieRecommendationWithMetadata({
  movie,
}: {
  movie: MovieRecommendation;
}): Promise<React.ReactNode> {
  "use server";
  const metadata = await getMovieMetadata(movie.title, movie.year.toString());
  return <MovieCard movie={movie} metadata={metadata} />;
}
