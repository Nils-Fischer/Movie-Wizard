import { getMovieMetadata, getMovieRecommendations } from "@/app/actions";
import { MovieCard } from "./MovieCard";

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
  if (!recommendations) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground text-lg">No recommendations found. Try a different search query.</p>
      </div>
    );
  }

  const metadata = await Promise.all(
    recommendations.map(async (movie) => await getMovieMetadata(movie.title, movie.year))
  );

  // Display a message if no recommendations were found
  if (recommendations.length === 0) {
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
          <MovieCard key={index} movie={movie} metadata={metadata[index] ?? undefined} />
        ))}
      </div>
    </div>
  );
}
