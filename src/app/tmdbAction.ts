import { z } from "zod";

// TMDB Movie Search Result Schema (partial, extend as needed)
const TmdbMovieResultSchema = z.object({
  id: z.number(),
  title: z.string(),
  original_title: z.string(),
  overview: z.string(),
  release_date: z.string(),
  genre_ids: z.array(z.number()),
  poster_path: z.string().nullable(),
  backdrop_path: z.string().nullable(),
  vote_average: z.number(),
  vote_count: z.number(),
  popularity: z.number(),
  original_language: z.string(),
});

const TmdbMovieSearchResponseSchema = z.object({
  page: z.number(),
  results: z.array(TmdbMovieResultSchema),
  total_results: z.number(),
  total_pages: z.number(),
});

type TmdbMovieResult = z.infer<typeof TmdbMovieResultSchema>;

/**
 * Fetches movies from TMDB by title (and optionally year).
 * Returns the first result or null if not found.
 */
async function searchTmdbMovie(title: string, year: string): Promise<TmdbMovieResult | null> {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    console.error("TMDB_API_KEY is not set in environment variables.");
    return null;
  }
  const url = `https://api.themoviedb.org/3/search/movie?query=${title}&include_adult=false&language=en-US&page=1&year=${year}`;
  //  const url = "https://api.themoviedb.org/3/search/movie?query=Avengers%20Endgame&include_adult=false&language=en-US&page=1&year=2019";

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    next: {
      revalidate: 3600 * 24, // 1 day
      tags: [`tmdb-movie-search-${title}-${year ?? "any"}`],
    },
  };

  try {
    let response = await fetch(url, options);
    if (!response.ok) {
      console.warn(`TMDB HTTP error! status: ${response.status}. Retrying once...`);
      response = await fetch(url, options);
      if (!response.ok) {
        console.error(`TMDB HTTP error after retry! status: ${response.status}`);
        return null;
      }
    }
    const data = await response.json();
    const parsed = TmdbMovieSearchResponseSchema.safeParse(data);
    if (!parsed.success) {
      console.error("TMDB API response schema validation failed", parsed.error);
      return null;
    }
    if (!parsed.data.results.length) {
      console.log(`No TMDB results for: ${title} (${year ?? "any"})`);
      return null;
    }
    return parsed.data.results[0];
  } catch (error) {
    console.error("Error fetching TMDB movie data:", error);
    return null;
  }
}

// TMDB TV Search Result Schema (partial, extend as needed)
const TmdbTvResultSchema = z.object({
  id: z.number(),
  name: z.string(),
  original_name: z.string(),
  overview: z.string(),
  first_air_date: z.string(),
  genre_ids: z.array(z.number()),
  poster_path: z.string().nullable(),
  backdrop_path: z.string().nullable(),
  vote_average: z.number(),
  vote_count: z.number(),
  popularity: z.number(),
  original_language: z.string(),
});

const TmdbTvSearchResponseSchema = z.object({
  page: z.number(),
  results: z.array(TmdbTvResultSchema),
  total_results: z.number(),
  total_pages: z.number(),
});

type TmdbTvResult = z.infer<typeof TmdbTvResultSchema>;

/**
 * Fetches TV shows from TMDB by title (and optionally year).
 * Returns the first result or null if not found.
 */
async function searchTmdbTvShow(title: string, year: string): Promise<TmdbTvResult | null> {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    console.error("TMDB_API_KEY is not set in environment variables.");
    return null;
  }
  const params = new URLSearchParams({
    api_key: apiKey,
    query: title,
    first_air_date_year: year,
    include_adult: "true",
    language: "en-US",
    page: "1",
  });
  const apiUrl = `https://api.themoviedb.org/3/search/tv?${params.toString()}`;

  try {
    let response = await fetch(apiUrl, {
      next: {
        revalidate: 3600 * 24, // 1 day
        tags: [`tmdb-tv-search-${title}-${year}`],
      },
    });
    if (!response.ok) {
      console.warn(`TMDB TV HTTP error! status: ${response.status}. Retrying once...`);
      response = await fetch(apiUrl, {
        next: {
          revalidate: 3600 * 24,
          tags: [`tmdb-tv-search-${title}-${year}`],
        },
      });
      if (!response.ok) {
        console.error(`TMDB TV HTTP error after retry! status: ${response.status}`);
        return null;
      }
    }
    const data = await response.json();
    const parsed = TmdbTvSearchResponseSchema.safeParse(data);
    if (!parsed.success) {
      console.error("TMDB TV API response schema validation failed", parsed.error);
      return null;
    }
    if (!parsed.data.results.length) {
      console.log(`No TMDB TV results for: ${title} (${year})`);
      return null;
    }
    return parsed.data.results[0];
  } catch (error) {
    console.error("Error fetching TMDB TV show data:", error);
    return null;
  }
}

export const TmdbSearchResultSchema = z.object({
  id: z.number(),
  title: z.string(),
  original_title: z.string(),
  description: z.string(),
  release_date: z.string(),
  poster_url: z.string().optional(),
  backdrop_url: z.string().optional(),
  original_language: z.string(),
});

export type TmdbSearchResult = z.infer<typeof TmdbSearchResultSchema>;

function getTmdbImageUrl(path: string | null | undefined, size?: string): string | undefined {
  return path ? `https://image.tmdb.org/t/p/${size ?? ""}${path}` : undefined;
}

// Use TMDB's w400_and_h600_bestv2 for poster images
const POSTER_SIZE = "w780";

function transformMovieResult(result: TmdbMovieResult): TmdbSearchResult {
  return {
    id: result.id,
    title: result.title,
    original_title: result.original_title,
    description: result.overview,
    release_date: result.release_date,
    poster_url: getTmdbImageUrl(result.poster_path, POSTER_SIZE),
    backdrop_url: getTmdbImageUrl(result.backdrop_path),
    original_language: result.original_language,
  };
}

function transformTvResult(result: TmdbTvResult): TmdbSearchResult {
  return {
    id: result.id,
    title: result.name,
    original_title: result.original_name,
    description: result.overview,
    release_date: result.first_air_date,
    poster_url: getTmdbImageUrl(result.poster_path, POSTER_SIZE),
    backdrop_url: getTmdbImageUrl(result.backdrop_path),
    original_language: result.original_language,
  };
}

export async function searchTmdb(title: string, year: string): Promise<TmdbSearchResult | null> {
  "use server";

  const movie = await searchTmdbMovie(title, year);
  if (movie) return transformMovieResult(movie);
  const tv = await searchTmdbTvShow(title, year);
  if (tv) return transformTvResult(tv);
  return null;
}
