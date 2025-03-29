import { Input } from "@/components/ui/input";
import { FilmIcon, Search } from "lucide-react";

export default function Home() {
  return (
    <main className="p-6 md:p-12 lg:p-24 flex flex-col justify-between min-h-screen max-w-4xl mx-auto">
      <div className="space-y-8 text-center items-center">
        <div className="flex flex-row justify-center items-center gap-3">
          <FilmIcon className="h-12 w-12 text-primary" />
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">Flick Finder</h1>
        </div>

        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
          Tell us what you&apos;re in the mood for, and we&apos;ll help you find the perfect movie to watch.
        </p>
      </div>

      <div className="flex flex-row items-center gap-4 mt-8 md:mt-0">
        <Input
          placeholder="What would you like to watch today?"
          className="flex-1 md:text-xl py-8 px-4 placeholder:text-xl"
        />
        <button className="flex font-semibold items-center justify-center gap-2 bg-foreground hover:bg-primary text-primary-foreground px-6 py-4 text-2xl rounded-md transition-colors whitespace-nowrap">
          <Search strokeWidth={2.5} className="h-7 w-7" />
          <div>Search</div>
        </button>
      </div>
      <div className="py-6" />
    </main>
  );
}
