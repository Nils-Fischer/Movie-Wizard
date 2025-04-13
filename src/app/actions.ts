"server-only";

import { OmdbMovieData } from "@/lib/movieTypes";

export async function getMovieMetadata(title: string, year: string): Promise<OmdbMovieData | null> {
  const apiKey = process.env.OMDB_API_KEY;
  const apiUrl = `https://www.omdbapi.com/?apikey=${apiKey}&t=${encodeURIComponent(title)}&y=${encodeURIComponent(year)}`;

  try {
    const response = await fetch(apiUrl, {
      next: {
        revalidate: 3600, // 1 hour
        tags: [`movie-metadata-${title}-${year}`],
      },
    });
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      return null;
    }

    const data: OmdbMovieData = await response.json();

    if (data.Response === "False") {
      if (data.Error !== "Movie not found!") {
        console.error("OMDb API Error:", data.Error);
      }
      return null;
    }

    if (data.Poster && data.Poster !== "N/A") {
      data.Poster = data.Poster.replace(/\._V1_SX\d+/, "");
    } else {
      data.Poster = "";
    }

    return data;
  } catch (error) {
    console.error("Error fetching movie metadata:", error);
    return null;
  }
}
