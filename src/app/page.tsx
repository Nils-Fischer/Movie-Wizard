import { Input } from "@/components/ui/input";
import { FilmIcon, Search } from "lucide-react";
import { MovieRecommendations } from "@/components/MovieRecommendations";
import { ScrollToComponent } from "@/components/ScrollToComponent";
import { Suspense } from "react";

export default async function Home({ searchParams }: { searchParams: { query?: string } }) {
  const params = await searchParams;
  const searchQuery = params.query || "";

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col justify-between gap-16 p-6 sm:gap-28 md:p-12 lg:p-24">
      <div className="items-center space-y-8 text-center">
        <div className="flex flex-row items-center justify-center gap-3">
          <FilmIcon className="text-primary h-10 w-10 sm:h-12 sm:w-12" />
          <h1 className="text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl">Flick Finder</h1>
        </div>

        <p className="text-muted-foreground mx-auto max-w-2xl text-lg sm:text-xl md:text-2xl">
          Tell us what you&apos;re in the mood for, and we&apos;ll help you find the perfect movie to watch.
        </p>
      </div>

      <div className="mt-8 flex flex-col space-y-8 md:mt-0">
        <form action="/" method="GET" className="w-full">
          <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
            <Input
              name="query"
              placeholder="What would you like to watch today?"
              className="flex-1 px-3 py-4 text-base placeholder:text-base md:px-4 md:py-8 md:text-xl md:placeholder:text-xl"
              defaultValue={searchQuery}
            />
            <button
              type="submit"
              className="bg-foreground hover:bg-primary text-primary-foreground flex w-full items-center justify-center gap-2 rounded-md px-4 py-3 text-lg font-semibold whitespace-nowrap transition-colors sm:w-auto md:px-6 md:py-4 md:text-2xl"
            >
              <Search strokeWidth={2.5} className="h-5 w-5 md:h-7 md:w-7" />
              <div>Search</div>
            </button>
          </div>
        </form>
      </div>
      {searchQuery ? (
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
      ) : (
        <div className="py-12 text-center" />
      )}
    </main>
  );
}
