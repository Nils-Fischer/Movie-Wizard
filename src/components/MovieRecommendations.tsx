import { getMovieRecommendations, MovieRecommendation } from "@/app/actions";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
      <h2 className="text-4xl font-semibold">Recommended Movies</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {recommendations.map((movie, index) => (
          <MovieCard key={index} movie={movie} />
        ))}
      </div>
    </div>
  );
}

function MovieCard({ movie }: { movie: MovieRecommendation }) {
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg">
      <div className="bg-muted relative h-48 w-full p-4">
        {/* Placeholder for movie image - will be replaced with actual API image later */}
        <div className="text-muted-foreground absolute inset-0 flex items-center justify-center">
          <span className="text-sm">Movie poster coming soon</span>
        </div>
      </div>

      <CardHeader className="-mb-4 flex items-start justify-between">
        <h3 className="text-xl font-semibold">{movie.title}</h3>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-start justify-start gap-1">
          <Badge variant="outline">{movie.year}</Badge>
          <Badge variant="default" className="text-xs">
            {movie.genre}
          </Badge>
        </div>
        <p className="text-muted-foreground text-sm">{movie.description}</p>
      </CardContent>
    </Card>
  );
}
