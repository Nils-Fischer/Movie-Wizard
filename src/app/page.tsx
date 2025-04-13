"use client";

import { Input } from "@/components/ui/input";
import { FilmIcon, Search } from "lucide-react";
import { ScrollToComponent } from "@/components/ScrollToComponent";
import { useState } from "react";
import { streamMovieRecommendationsUI } from "@/components/MovieRecommendations";
import React from "react";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const searchParams = useSearchParams();
  const initialSearchQuery = searchParams.get("query") || "";
  const [inputValue, setInputValue] = useState(initialSearchQuery);

  const [recommendations, setRecommendations] = useState<null | React.ReactNode>(null);

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col justify-between gap-16 p-6 sm:gap-28 md:p-12 lg:p-24">
      <div className="items-center space-y-8 text-center">
        <div className="flex flex-row items-center justify-center gap-3">
          <FilmIcon className="text-primary h-10 w-10 sm:h-12 sm:w-12" />
          <h1 className="text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl">Movie Wizard</h1>
        </div>
        <p className="text-muted-foreground mx-auto max-w-2xl text-lg sm:text-xl md:text-2xl">
          Tell us what you&apos;re in the mood for, and we&apos;ll help you find the perfect movie to watch.
        </p>
      </div>

      <div className="mt-8 flex flex-col space-y-8 md:mt-0">
        <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
          <Input
            name="query"
            placeholder="What would you like to watch today?"
            className="flex-1 px-3 py-4 text-base placeholder:text-base md:px-4 md:py-8 md:text-xl md:placeholder:text-xl"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button
            onClick={async () => {
              const recommendations = await streamMovieRecommendationsUI(inputValue);
              setRecommendations(recommendations);
            }}
            className="bg-foreground hover:bg-primary text-primary-foreground flex w-full items-center justify-center gap-2 rounded-md px-4 py-3 text-lg font-semibold whitespace-nowrap transition-colors sm:w-auto md:px-6 md:py-4 md:text-2xl"
          >
            <Search strokeWidth={2.5} className="h-5 w-5 md:h-7 md:w-7" />
            <div>Search</div>
          </button>
        </div>
      </div>
      {recommendations !== null ? (
        <ScrollToComponent>{recommendations}</ScrollToComponent>
      ) : (
        <div className="py-12 text-center" />
      )}
    </main>
  );
}
