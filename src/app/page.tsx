import { Input } from "@/components/ui/input";
import { FilmIcon, Search } from "lucide-react";
import { MovieRecommendations } from "@/components/MovieRecommendations";
import { ScrollToComponent } from "@/components/ScrollToComponent";
import { Suspense } from "react";

export default async function Home({ searchParams }: { searchParams: { query?: string } }) {
  const params = await searchParams;
  const searchQuery = params.query || "";

  return (
    <main className="p-6 md:p-12 lg:p-24 flex flex-col gap-16 sm:gap-28 justify-between min-h-screen max-w-6xl mx-auto">
      <div className="space-y-8 text-center items-center">
        <div className="flex flex-row justify-center items-center gap-3">
          <FilmIcon className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">Flick Finder</h1>
        </div>

        <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
          Tell us what you&apos;re in the mood for, and we&apos;ll help you find the perfect movie to watch.
        </p>
      </div>

      <div className="flex flex-col space-y-8 mt-8 md:mt-0">
        <form action="/" method="GET" className="w-full">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Input
              name="query"
              placeholder="What would you like to watch today?"
              className="flex-1 text-base py-4 px-3 placeholder:text-base md:text-xl md:py-8 md:px-4 md:placeholder:text-xl"
              defaultValue={searchQuery}
            />
            <button
              type="submit"
              className="flex font-semibold items-center justify-center gap-2 bg-foreground hover:bg-primary text-primary-foreground w-full sm:w-auto px-4 py-3 text-lg md:px-6 md:py-4 md:text-2xl rounded-md transition-colors whitespace-nowrap"
            >
              <Search strokeWidth={2.5} className="h-5 w-5 md:h-7 md:w-7" />
              <div>Search</div>
            </button>
          </div>
        </form>
      </div>
      <Suspense
        fallback={
          <div className="py-12 text-center">
            <p className="text-muted-foreground">Loading recommendations...</p>
          </div>
        }
      >
        <ScrollToComponent>
          <MovieRecommendations searchQuery={searchQuery} />
        </ScrollToComponent>
      </Suspense>
    </main>
  );
}
