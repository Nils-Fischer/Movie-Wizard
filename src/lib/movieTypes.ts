import { z } from "zod";

export interface OmdbMovieData {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string; // URL
  Ratings: Array<{ Source: string; Value: string }>;
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD?: string;
  BoxOffice?: string;
  Production?: string;
  Website?: string;
  Response: "True" | "False";
  Error?: string;
}

export const MovieRecommendationSchema = z.object({
  title: z.string(),
  year: z.number().min(1800).max(new Date().getFullYear()),
  genre: z.string(),
  description: z.string(),
});

export const MovieRecommendationsSchema = z.array(MovieRecommendationSchema);

export type MovieRecommendation = z.infer<typeof MovieRecommendationSchema>;
