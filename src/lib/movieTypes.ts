import { z } from "zod";

export const OmdbMovieDataSchema = z.object({
  Title: z.string(),
  Year: z.string(),
  Rated: z.string(),
  Released: z.string(),
  Runtime: z.string(),
  Genre: z.string(),
  Director: z.string(),
  Writer: z.string(),
  Actors: z.string(),
  Plot: z.string(),
  Language: z.string(),
  Country: z.string(),
  Awards: z.string(),
  Poster: z.string(), // URL
  Ratings: z.array(z.object({ Source: z.string(), Value: z.string() })),
  Metascore: z.string(),
  imdbRating: z.string(),
  imdbVotes: z.string(),
  imdbID: z.string(),
  Type: z.string(),
  DVD: z.string().optional(),
  BoxOffice: z.string().optional(),
  Production: z.string().optional(),
  Website: z.string().optional(),
  Response: z.enum(["True", "False"]),
  Error: z.string().optional(),
});

export type OmdbMovieData = z.infer<typeof OmdbMovieDataSchema>;

export const MovieRecommendationSchema = z.object({
  title: z.string(),
  year: z.number().min(1800).max(new Date().getFullYear()),
  genre: z.string(),
  description: z.string(),
});

export type MovieRecommendation = z.infer<typeof MovieRecommendationSchema>;

export const MovieRecommendationsSchema = z.array(MovieRecommendationSchema);

export const MovieRecommendationWithMetadataSchema = MovieRecommendationSchema.extend({
  metadata: OmdbMovieDataSchema.optional(),
});

export type MovieRecommendationWithMetadata = z.infer<typeof MovieRecommendationWithMetadataSchema>;
