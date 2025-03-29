import { getMovieRecommendations, MovieRecommendation } from "@/app/actions";

interface MovieRecommendationsProps {
  searchQuery: string;
}

export async function MovieRecommendations({ searchQuery }: MovieRecommendationsProps) {
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
      <h2 className="text-2xl font-semibold">Recommended Movies</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((movie, index) => (
          <MovieCard key={index} movie={movie} />
        ))}
      </div>
    </div>
  );
}

function MovieCard({ movie }: { movie: MovieRecommendation }) {
  return (
    <div className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow bg-card text-card-foreground">
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-semibold">{movie.title}</h3>
          <span className="text-sm text-muted-foreground">{movie.year}</span>
        </div>
        <div className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs rounded-md">{movie.genre}</div>
        <p className="text-sm text-muted-foreground">{movie.description}</p>
      </div>
    </div>
  );
}
