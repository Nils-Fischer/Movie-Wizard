import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { MovieRecommendation } from "./movieTypes";
import { CoreMessage } from "ai";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function movieRecommendationKey(movie: MovieRecommendation) {
  return `${movie.title}-${movie.year}`;
}

export function splitIntoChunks<T>(arr: T[], chunkSize: number = 20): T[][] {
  return Array.from({ length: Math.ceil(arr.length / chunkSize) }, (_, i) =>
    arr.slice(i * chunkSize, (i + 1) * chunkSize)
  );
}

function previouslyRecommedMoviesToMessage(previouslyRecommendedMovies: MovieRecommendation[]): CoreMessage[] {
  const chunks = splitIntoChunks(previouslyRecommendedMovies, 20);
  const messages: CoreMessage[] = [];
  chunks.forEach((recommendations, index) => {
    messages.push({
      role: "assistant",
      content: JSON.stringify(recommendations),
    });
    if (index < chunks.length - 1) {
      messages.push({
        role: "user",
        content: "generate more recommendations",
      });
    }
  });
  return messages;
}

export function getMessages(
  userQuery: string,
  previouslyRecommendedMovies?: MovieRecommendation[],
  clickedMovies?: string[]
): CoreMessage[] {
  const messages: CoreMessage[] = [];

  messages.push({
    role: "user",
    content: userQuery,
  });

  if (!previouslyRecommendedMovies || !clickedMovies) return messages;

  messages.push(...previouslyRecommedMoviesToMessage(previouslyRecommendedMovies));

  const clickedMoviesString =
    clickedMovies && clickedMovies.length > 0
      ? `Here are all of the movies that the user has clicked on: ${clickedMovies.join(", ")}`
      : "";

  messages.push({
    role: "user",
    content: `generate more recommendations, don't repeat any movies you already recommended! ${clickedMoviesString}`,
  });
  return messages;
}
