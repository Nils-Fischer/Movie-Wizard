import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MovieRecommendationWithMetadata, OmdbMovieData } from "@/lib/movieTypes";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  StarIcon,
  CalendarIcon,
  GlobeIcon,
  AwardIcon,
  FilmIcon,
  UsersIcon,
  DollarSignIcon,
  BuildingIcon,
  LinkIcon,
} from "lucide-react";
import Link from "next/link";

interface MovieModalProps {
  movie: MovieRecommendationWithMetadata | null;
  isOpen: boolean;
  onClose: () => void;
}

export function MovieModal({ movie, isOpen, onClose }: MovieModalProps) {
  if (!movie || !movie.metadata) return null;

  const {
    Title,
    Year,
    Rated,
    Released,
    Runtime,
    Genre,
    Director,
    Writer,
    Actors,
    Plot,
    Language,
    Country,
    Awards,
    Poster,
    Ratings,
    Metascore,
    BoxOffice,
    Production,
    Website,
    imdbRating,
  } = movie.metadata;

  const ratingSources =
    Ratings?.reduce(
      (acc, rating) => {
        acc[rating.Source] = rating.Value;
        return acc;
      },
      {} as Record<string, string>
    ) ?? {};

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl">
        <DialogHeader className="mb-4 items-center justify-center pr-6">
          <DialogTitle className="text-2xl font-bold md:text-3xl lg:text-4xl">{Title}</DialogTitle>
          <div className="text-muted-foreground mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm sm:text-base">
            {Year && <span>{Year}</span>}
            {Rated && Rated !== "N/A" && (
              <>
                <span>•</span>
                <Badge variant="outline" className="px-1.5 py-0.5 text-xs">
                  {Rated}
                </Badge>
              </>
            )}
            {Runtime && Runtime !== "N/A" && (
              <>
                <span>•</span>
                <span>{Runtime}</span>
              </>
            )}
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="md:col-span-1">
            {Poster && Poster !== "N/A" ? (
              <Image
                unoptimized
                src={Poster}
                alt={`Poster for ${Title}`}
                width={300}
                height={450}
                className="h-auto w-full rounded-lg object-cover shadow-md"
                quality={75}
                priority
              />
            ) : (
              <div className="bg-muted text-muted-foreground flex h-full min-h-[450px] w-full items-center justify-center rounded-lg">
                No Poster Available
              </div>
            )}
          </div>

          <div className="space-y-6 md:col-span-2">
            <div>
              <h3 className="mb-2 text-xl font-semibold">Plot Summary</h3>
              <p className="text-muted-foreground">{Plot}</p>
            </div>

            <Separator />

            <div>
              <h3 className="mb-3 text-xl font-semibold">Details</h3>
              <div className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
                <DetailItem icon={FilmIcon} label="Genre" value={Genre} />
                <DetailItem icon={CalendarIcon} label="Released" value={Released} />
                <DetailItem icon={GlobeIcon} label="Language" value={Language} />
                <DetailItem icon={GlobeIcon} label="Country" value={Country} />
                <DetailItem icon={UsersIcon} label="Director" value={Director} />
                <DetailItem icon={UsersIcon} label="Writer" value={Writer} />
                <DetailItem icon={UsersIcon} label="Actors" value={Actors} />
                {Awards && Awards !== "N/A" && <DetailItem icon={AwardIcon} label="Awards" value={Awards} />}
                {Production && Production !== "N/A" && (
                  <DetailItem icon={BuildingIcon} label="Production" value={Production} />
                )}
                {BoxOffice && BoxOffice !== "N/A" && (
                  <DetailItem icon={DollarSignIcon} label="Box Office" value={BoxOffice} />
                )}
                {Website && Website !== "N/A" && (
                  <DetailItem icon={LinkIcon} label="Website" value={Website} link={Website} />
                )}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="mb-3 text-xl font-semibold">Ratings</h3>
              <div className="flex flex-wrap items-center gap-4">
                {imdbRating && imdbRating !== "N/A" && (
                  <RatingBadge
                    source="IMDb"
                    value={imdbRating}
                    icon={StarIcon}
                    svgSrc="/imdb.svg"
                    link={getLink(movie.metadata, "IMDb")}
                  />
                )}
                {ratingSources["Rotten Tomatoes"] && (
                  <RatingBadge
                    source="Rotten Tomatoes"
                    value={ratingSources["Rotten Tomatoes"]}
                    svgSrc="/rottentomatoes.svg"
                    link={getLink(movie.metadata, "Rotten Tomatoes")}
                  />
                )}
                {Metascore && Metascore !== "N/A" && (
                  <RatingBadge
                    source="Metascore"
                    value={`${Metascore}/100`}
                    svgSrc="/metascore.svg"
                    link={getLink(movie.metadata, "Metascore")}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Helper subcomponents
function DetailItem({
  icon: Icon,
  label,
  value,
  link,
}: {
  icon: React.ElementType;
  label: string;
  value: string | undefined;
  link?: string;
}) {
  if (!value || value === "N/A") return null;
  return (
    <div className="flex items-start text-sm">
      <Icon className="text-muted-foreground mt-0.5 mr-2 h-4 w-4 flex-shrink-0" />
      <div>
        <span className="font-medium">{label}:</span>{" "}
        {link ? (
          <a
            href={link.startsWith("http") ? link : `https://${link}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 underline"
          >
            {value}
          </a>
        ) : (
          <span className="text-muted-foreground">{value}</span>
        )}
      </div>
    </div>
  );
}

// Updated RatingBadge Props
interface RatingBadgeProps {
  source: string;
  value: string;
  icon?: React.ElementType; // For Lucide icons (like IMDb)
  svgSrc?: string; // For SVG images (like RT, Metascore)
  link?: string;
}

// Updated RatingBadge Implementation
function RatingBadge({ source, value, icon: Icon, svgSrc, link }: RatingBadgeProps) {
  const badgeContent = (
    <Badge variant="secondary" className="flex items-center gap-1.5 px-2.5 py-1 text-sm font-medium">
      {svgSrc ? (
        <Image src={svgSrc} alt={`${source} logo`} width={24} height={24} className="h-6 w-6" />
      ) : Icon ? (
        <Icon
          className={`h-6 w-6 flex-shrink-0 ${source === "IMDb" ? "text-yellow-500" : "text-muted-foreground"}`}
          aria-hidden="true"
        />
      ) : null}
      <span className="ml-0.5">{value}</span>
    </Badge>
  );
  if (link) {
    return (
      <Link
        href={link.startsWith("http") ? link : `https://${link}`}
        passHref
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block cursor-pointer transition-transform hover:scale-105"
      >
        {badgeContent}
      </Link>
    );
  }
  return badgeContent;
}

function getLink(metadata: OmdbMovieData, source: "Rotten Tomatoes" | "Metascore" | "IMDb") {
  if (source === "Rotten Tomatoes") {
    const prefix = metadata.Type === "movie" ? "m" : "tv";
    const title = metadata.Title.replace(/ /g, "_").toLowerCase();
    return `https://www.rottentomatoes.com/${prefix}/${title}`;
  }
  if (source === "Metascore") {
    const prefix = metadata.Type === "movie" ? "movie" : "tv";
    const title = metadata.Title.replace(/ /g, "-").toLowerCase();
    return `https://www.metacritic.com/${prefix}/${title}`;
  }
  if (source === "IMDb") {
    return `https://www.imdb.com/title/${metadata.imdbID}`;
  }
}
