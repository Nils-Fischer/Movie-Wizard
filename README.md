# Movie Wizard: AI-Powered Movie Recommendations

Never spend hours scrolling for something to watch again! Movie Wizard uses AI to give you personalized movie suggestions based on your mood and preferences.

**Try it now:** [https://moviewizard.me/](https://moviewizard.me/)

## Key Features

- **Intelligent AI Suggestions:** Describe what you want to watch (a genre, an actor, a vibe, etc.), and our AI, powered by Gemini 2.0 Flash, will find movies you'll love.
- **Live Streaming Recommendations:** No waiting! Suggestions appear on your screen in real-time as the AI generates them, using the Vercel AI SDK's streaming functionality.
- **Instant Movie Details:** We fetch and cache movie posters, summaries, and other metadata from the OMDB API the moment a potential recommendation (title and year) is streamed. This means you see relevant info immediately, even before the full list of suggestions is complete.
- **Responsive Design:** Enjoy a seamless experience on any device.

## Technology Breakdown

Movie Wizard is built using a modern web stack:

- **Frontend:** Next.js (App Router) provides the foundation for a fast and interactive user interface built with React.
- **AI Integration:** The Vercel AI SDK handles communication with Google's Gemini 2.0 Flash model, enabling natural language understanding and recommendation generation.
- **Data Fetching:** The OMDB API serves as the source for rich movie metadata. Efficient caching strategies ensure quick loading of details.
