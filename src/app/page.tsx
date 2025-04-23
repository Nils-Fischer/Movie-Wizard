"use client";

import { Input } from "@/components/ui/input";
import { FilmIcon, Search } from "lucide-react";
import { ScrollToComponent } from "@/components/ScrollToComponent";
import { useState, useEffect } from "react";
import { streamMovieRecommendations } from "@/app/actions";
import { useSearchParams } from "next/navigation";
import { readStreamableValue } from "ai/rsc";
import { MovieRecommendationWithMetadata } from "@/lib/movieTypes";
import { MovieCard } from "@/components/MovieCard";
import { MovieModal } from "@/components/MovieModal";
import React from "react";
import { Marquee } from "@/components/magicui/marquee";
import { promptExamples, shuffleArray } from "@/lib/promptExamples";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

export default function Home() {
  const searchParams = useSearchParams();
  const initialSearchQuery = searchParams.get("query") || "";

  const [inputValue, setInputValue] = useState(initialSearchQuery);

  const [recommendations, setRecommendations] = useState<null | MovieRecommendationWithMetadata[]>(null);
  const [selectedMovie, setSelectedMovie] = useState<MovieRecommendationWithMetadata | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const [prompts, setPrompts] = useState<string[]>(promptExamples);
  useEffect(() => {
    setPrompts(shuffleArray(promptExamples));
  }, []);

  function handleMovieClick(movie: MovieRecommendationWithMetadata) {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setSelectedMovie(null);
  }

  async function handleSearch() {
    console.log("Searching for movies...", inputValue);
    setRecommendations(null);
    setIsGenerating(true);
    const { value } = await streamMovieRecommendations(inputValue);

    for await (const movies of readStreamableValue(value)) {
      if (movies) {
        const uniqueMovies = Array.from(
          movies
            .reduce((map, movie) => {
              const key = `${movie.title}-${movie.year}`;
              if (!map.has(key)) {
                map.set(key, movie);
              }
              return map;
            }, new Map<string, MovieRecommendationWithMetadata>())
            .values()
        );
        setRecommendations(uniqueMovies);
      } else {
        setRecommendations(null);
      }
    }
    setIsGenerating(false);
  }

  function handleMovieError(movie: MovieRecommendationWithMetadata) {
    movie.metadata = undefined;
    const updatedMovies: MovieRecommendationWithMetadata[] | undefined = recommendations?.map((m) =>
      m.title === movie.title && m.year === movie.year ? { ...m, metadata: m.metadata } : m
    );
    setRecommendations(updatedMovies ?? null);
  }

  async function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      await handleSearch();
    }
  }

  return (
    <main className="flex min-h-screen flex-col">
      <div className="flex max-w-7xl flex-col justify-between gap-16 p-4 py-8 sm:gap-28 sm:p-8 md:p-12 lg:p-24 xl:m-28">
        <div className="items-center space-y-8 text-center">
          <div className="flex flex-row items-center justify-center gap-3">
            <FilmIcon className="text-primary h-10 w-10 sm:h-14 sm:w-14" />
            <h1 className="font-heading text-4xl font-bold sm:text-4xl md:text-5xl lg:text-6xl">Movie Wizard</h1>
          </div>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg sm:text-xl md:text-2xl">
            Tell us what you&apos;re in the mood for, and we&apos;ll help you find the perfect movie to watch.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-2 md:mt-0">
          <Marquee pauseOnHover className="[--duration:1000s]">
            {prompts.map((prompt) => (
              <div
                key={prompt}
                onClick={() => setInputValue(prompt)}
                className="bg-card text-card-foreground hover:bg-primary/10 hover:border-primary mx-2 cursor-pointer rounded-lg border p-3 text-sm font-medium"
              >
                {prompt}
              </div>
            ))}
          </Marquee>
          <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
            <Input
              name="query"
              placeholder="What would you like to watch today?"
              className="flex-1 px-3 py-4 text-base placeholder:text-base md:px-4 md:py-8 md:text-xl md:placeholder:text-xl"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              onClick={handleSearch}
              className="bg-foreground hover:bg-primary text-primary-foreground flex w-full items-center justify-center gap-2 rounded-md px-4 py-3 text-lg font-semibold whitespace-nowrap transition-colors disabled:opacity-50 sm:w-auto md:px-6 md:py-4 md:text-2xl"
              disabled={inputValue.length === 0 || isGenerating}
            >
              <Search strokeWidth={2.5} className="h-5 w-5 md:h-7 md:w-7" />
              <div>Search</div>
            </button>
          </div>
        </div>
      </div>
      {recommendations !== null && recommendations.length > 0 ? (
        <ScrollToComponent key={recommendations ? "results" : "no-results"}>
          <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex flex-row items-end justify-start gap-2">
              <h3 className="text-xl font-semibold sm:text-4xl">Recommended Movies</h3>
              <p className="text-muted-foreground text-sm italic sm:text-base md:text-lg">Click for details</p>
            </div>
            <div className="grid grid-cols-3 gap-2 md:grid-cols-3 md:gap-4 lg:grid-cols-4 lg:gap-6">
              {recommendations.map((recommendation) => {
                return (
                  <MovieCard
                    key={`${recommendation.title}-${recommendation.year}`}
                    movie={recommendation}
                    onClick={() => handleMovieClick(recommendation)}
                    handleError={() => handleMovieError(recommendation)}
                  />
                );
              })}
            </div>
          </div>
        </ScrollToComponent>
      ) : (
        <div className="py-12 text-center" />
      )}
      <MovieModal movie={selectedMovie} isOpen={isModalOpen} onClose={handleCloseModal} />
    </main>
  );
}
