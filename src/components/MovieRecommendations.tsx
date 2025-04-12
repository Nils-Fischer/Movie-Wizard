import { getMovieMetadata, getMovieRecommendations } from "@/app/actions";
import { MovieCard } from "./MovieCard";
import { Suspense } from "react";
import { MovieRecommendation } from "@/lib/movieTypes";

interface MovieRecommendationsProps {
  searchQuery: string;
}

export async function MovieRecommendations({ searchQuery }: MovieRecommendationsProps) {
  "use server";
  // If no search query is provided, don't fetch recommendations
  if (!searchQuery || searchQuery.trim() === "") {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground text-lg">Enter a search query to get movie recommendations</p>
      </div>
    );
  }

  // Fetch movie recommendations using the server action
  const recommendations = await getMovieRecommendations(searchQuery);

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground text-lg">No recommendations found. Try a different search query.</p>
      </div>
    );
  }

  // Display the movie recommendations
  return (
    <div className="space-y-8 py-8">
      <h2 className="text-4xl font-semibold">Recommended Movies</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {recommendations.map((movie, index) => (
          <Suspense key={index} fallback={<MovieCard movie={movie} />}>
            <MovieRecommendationWithMetadata movie={movie} />
          </Suspense>
        ))}
      </div>
    </div>
  );
}

export async function MovieRecommendationWithMetadata({
  movie,
}: {
  movie: MovieRecommendation;
}): Promise<React.ReactNode> {
  "use server";
  const metadata = await getMovieMetadata(movie.title, movie.year);
  return <MovieCard movie={movie} metadata={metadata} />;
}
