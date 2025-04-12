import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { OmdbMovieData, MovieRecommendation } from "@/lib/movieTypes";
import { Loader2 } from "lucide-react";

export function MovieCard({ movie, metadata }: { movie: MovieRecommendation; metadata?: OmdbMovieData | null }) {
  return (
    <Card className="overflow-hidden pt-0 transition-shadow hover:shadow-lg">
      <div className="bg-muted relative h-100 w-full p-4">
        <div className="text-muted-foreground absolute inset-0 flex items-center justify-center">
          {metadata?.Poster ? (
            <Image
              src={metadata.Poster}
              alt={movie.title}
              width={500}
              height={750}
              className="h-full w-full object-cover"
            />
          ) : metadata === null ? (
            <div className="text-sm">No poster available</div>
          ) : (
            <Loader2 className="h-8 w-8 animate-spin" />
          )}
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
