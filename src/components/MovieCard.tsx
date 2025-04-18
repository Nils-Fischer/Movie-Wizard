import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MovieRecommendationWithMetadata } from "@/lib/movieTypes";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function MovieCard({ movie }: { movie: MovieRecommendationWithMetadata }) {
  return (
    <Card className="overflow-hidden pt-0 transition-shadow hover:shadow-lg">
      <div className="bg-muted relative h-100 w-full p-4">
        <div className="text-muted-foreground absolute inset-0 flex items-center justify-center">
          {movie.metadata?.Poster ? (
            <Image
              unoptimized
              src={movie.metadata.Poster}
              alt={movie.title}
              width={300}
              height={450}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              placeholder="blur"
              blurDataURL={movie.metadata.Poster}
              className="h-full w-full object-cover"
              quality={30}
              loading="eager"
            />
          ) : movie.metadata === null ? (
            <div className="text-sm">No poster available</div>
          ) : (
            <Loader2 className="h-8 w-8 animate-spin" />
          )}
        </div>
      </div>

      <CardHeader className="-mb-4 flex items-start justify-between">
        {movie.title ? <h3 className="text-xl font-semibold">{movie.title}</h3> : <Skeleton className="h-6 w-3/4" />}
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-start justify-start gap-1">
          {movie.year ? <Badge variant="outline">{movie.year}</Badge> : <Skeleton className="h-5.5 w-11" />}
          {movie.genre ? (
            <Badge variant="default" className="text-xs">
              {movie.genre}
            </Badge>
          ) : (
            <Skeleton className="h-5 w-20" />
          )}
        </div>
        {movie.description ? (
          <p className="text-muted-foreground text-sm">{movie.description}</p>
        ) : (
          <div className="space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-4/6" />
            <Skeleton className="h-3 w-5/6" />
            <Skeleton className="h-3 w-6/6" />
            <Skeleton className="h-3 w-3/6" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
