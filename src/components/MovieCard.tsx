import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MovieRecommendationWithMetadata } from "@/lib/movieTypes";
import Image from "next/image";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

export function MovieCard({
  movie,
  onClick,
  handleError,
}: {
  movie: MovieRecommendationWithMetadata;
  onClick: (movie: MovieRecommendationWithMetadata) => void;
  handleError: (movie: MovieRecommendationWithMetadata) => void;
}) {
  const [imageSrc, setImageSrc] = useState<string | undefined | null>(undefined);

  useEffect(() => {
    if (movie.metadata?.Poster) {
      setImageSrc(movie.metadata.Poster);
    }
  }, [movie.metadata?.Poster]);

  return (
    <Card
      onClick={() => onClick(movie)}
      className="w-full max-w-xs cursor-pointer overflow-hidden pt-0 pb-0 transition-shadow hover:shadow-lg sm:max-w-sm sm:pb-4 md:max-w-md lg:max-w-lg xl:max-w-xl"
    >
      <div className="bg-muted relative h-72 w-full p-1 sm:h-80 sm:p-2 md:h-96 md:p-3 lg:h-[28rem] lg:p-4 xl:h-108">
        <div className="text-muted-foreground absolute inset-0 flex items-center justify-center">
          {movie.metadata?.Poster ? (
            <Image
              unoptimized
              src={imageSrc ?? movie.metadata?.Poster}
              alt={movie.title}
              width={180}
              height={270}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="h-full w-full rounded-md object-cover"
              quality={30}
              loading="eager"
              onError={(e) => {
                if (imageSrc && imageSrc?.endsWith(".avif")) {
                  console.log("Replacing avif with jpg for movie:", movie.title);
                  const newImageSrc = imageSrc.replace("QL90_UY600_CR1,1,400,600.avif", ".jpg");
                  setImageSrc(newImageSrc);
                } else {
                  console.error("Error loading poster for movie:", movie.title, e);
                  setImageSrc(null);
                  handleError(movie);
                }
              }}
            />
          ) : imageSrc === undefined ? (
            <Loader2 className="h-8 w-8 animate-spin" />
          ) : (
            <div className="flex items-center gap-2 text-sm">
              <AlertTriangle className="h-4 w-4" />
              No poster available
            </div>
          )}
        </div>
      </div>

      <CardHeader className="-mb-4 flex items-start justify-between px-2 sm:px-3 md:px-4 lg:px-6">
        {movie.title ? (
          <h3 className="text-md font-semibold md:text-xl">{movie.title}</h3>
        ) : (
          <Skeleton className="h-6 w-3/4" />
        )}
      </CardHeader>

      <CardContent className="space-y-3 px-2 pb-0 sm:px-2 md:px-3 lg:px-6">
        <div className="flex items-start justify-start gap-1">
          {movie.year ? <Badge variant="outline">{movie.year}</Badge> : <Skeleton className="h-5.5 w-11" />}
          {movie.genre ? (
            <Badge variant="default" className="hidden text-xs sm:block">
              {movie.genre}
            </Badge>
          ) : (
            <Skeleton className="hidden h-5 w-20 sm:block" />
          )}
        </div>
        {movie.description ? (
          <p className="text-muted-foreground hidden text-sm sm:block">{movie.description}</p>
        ) : (
          <div className="hidden space-y-2 sm:block">
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
