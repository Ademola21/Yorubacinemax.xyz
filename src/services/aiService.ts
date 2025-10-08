import { Movie, SiteConfig } from "./types";
import { getAnalyticsSummary } from "./analyticsService";
import { getSession } from "./storageService";

/**
 * A secure proxy function to communicate with our backend, which calls the Azure OpenAI API.
 * This prevents API keys from ever being exposed on the frontend.
 * @param params The parameters for the Azure OpenAI API call.
 * @returns The JSON response from the API.
 */
async function callAiProxy(params: any): Promise<any> {
  try {
    const session = getSession(); // Get the current user session for authentication

    console.log('[AI Proxy] Making request to /api/azure-ai');

    // Call the Azure OpenAI proxy endpoint
    const response = await fetch('/api/azure-ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ params, session }),
    });

    console.log('[AI Proxy] Response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'The AI service is currently unavailable.' }));
      const errorMessage = response.status === 429 
        ? `You're sending requests too quickly. Please wait a moment.`
        : errorData.error || `HTTP error! status: ${response.status}`;
      console.error(`[AI Proxy Error] Status ${response.status}:`, errorMessage);
      console.error(`[AI Proxy Error] Full error data:`, errorData);
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    console.log('[AI Proxy Success] Response data:', data);
    console.log('[AI Proxy Success] Response has text:', !!data.text);
    console.log('[AI Proxy Success] Text length:', data.text?.length || 0);
    
    // Validate response structure
    if (!data || typeof data.text !== 'string') {
      console.error('[AI Proxy Error] Invalid response structure:', data);
      throw new Error('Invalid response from AI service');
    }
    
    return data;
  } catch (error) {
    console.error(`[AI Proxy Error] Full error object:`, error);
    console.error(`[AI Proxy Error] Error type:`, error?.constructor?.name);
    console.error(`[AI Proxy Error] Error message:`, (error as Error)?.message);
    console.error(`[AI Proxy Error] Error stack:`, (error as Error)?.stack);
    // Re-throw a user-friendly error message
    throw new Error((error as Error).message || "I'm having a bit of trouble connecting right now. Please try asking me again in a moment.");
  }
}

const getSystemInstructionForChat = (movies: Movie[], siteConfig: SiteConfig, isAdmin: boolean) => {
    const movieContext = movies.map(movie => {
        return `ID: ${movie.id}, Title: ${movie.title}, Genre: ${movie.genre}, Category: ${movie.category}, Description: ${movie.description}`;
    }).join('\n');

    let instruction = `You are a smart and helpful AI assistant for "${siteConfig.name}", a Yoruba movie streaming website. Your primary goal is to help users.

- The website's URL structure for a movie is /#/movie/{id}. When a user asks for a movie that is available, you MUST provide them with the direct link. For example, a link to Jagun Jagun (ID: jagun-jagun) would be /#/movie/jagun-jagun.
- The Live TV page is currently ${siteConfig.liveTvEnabled ? 'online. You can direct users to /#/live-tv.' : 'offline. Inform users it is not available right now.'}
- For questions about movies available on our platform, answer them using the provided list. When you mention one of these movies, clearly state that it is available on ${siteConfig.name}.
- When asked for recommendations or a list of movies (e.g., "list all action movies"), suggest movies from the provided list.
- For any other questions about movies, actors, or cinema knowledge, use your extensive internal knowledge. If you do not have up-to-date information (e.g., about very recent events), state that your knowledge may not be current.
- If the user asks for a movie that is NOT on the platform list, state that it's not in our library and then ask "Would you like me to open a request form to send to the admin?" If the user says yes, respond with: "I can help you request it. Please fill out the form below." followed immediately by the special command [SHOW_MOVIE_REQUEST_FORM].
- If a user submits a movie request form with details (e.g., starting with "User has submitted a movie request form..."), your ONLY job is to respond with a confirmation message and a pre-filled email link for them to send. The email link MUST be a markdown mailto link. The recipient is ${siteConfig.contact.email}. The subject should be "New Movie Request: [Movie Title]". The body should contain all the details provided by the user. Example response: "Thanks! I've prepared the request. Please click the link to send it to our team: [Send Movie Request](mailto:${siteConfig.contact.email}?subject=New%20Movie%20Request&body=...)"
- Always be friendly and conversational. Do not output JSON.`;

    if (isAdmin) {
        const analytics = getAnalyticsSummary(1);
        instruction += `\n
---
**ADMINISTRATOR MODE ENABLED**
You are also an admin assistant. If asked about site performance or analytics, use the following real-time data to answer. Be concise and clear.

**Live Analytics Data (Last 24 hours):**
- Total Site Visits: ${analytics.dailyVisitors}
- New User Sign-ups: ${analytics.todaysSignups}
- Most Popular Movies (by page views):
  ${analytics.mostClicked.map((m, i) => `${i + 1}. ${m.title} (${m.clicks} views)`).join('\n') || 'No movie pages were viewed.'}
---`;
    } else {
        instruction += `\n
- **IMPORTANT RULE:** You are speaking to a regular user, NOT an admin. You MUST politely refuse any requests for site analytics, visitor counts, or performance metrics. Do not reveal any numbers or statistics.`;
    }

    instruction += `\nHere is the list of movies currently available on Yoruba Cinemax:
---
${movieContext}
---`;

    return instruction;
}


export interface AiChatResponse {
  text: string;
  movie?: Movie;
  sources?: { uri: string; title: string; }[];
}

export const runChat = async (prompt: string, movies: Movie[], siteConfig: SiteConfig, isAdmin: boolean = false): Promise<AiChatResponse> => {
   if (!movies || movies.length === 0) {
    return { text: "I'm still loading our movie catalog. Please ask me again in a moment!" };
  }

  try {
    const systemInstruction = getSystemInstructionForChat(movies, siteConfig, isAdmin);

    const response = await callAiProxy({
        systemInstruction: systemInstruction,
        userPrompt: prompt,
    });

    const aiText = response.text;
    let foundMovie: Movie | undefined = undefined;
    for (const movie of movies) {
      const movieTitleRegex = new RegExp(`\\b${movie.title.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i');
      if (movieTitleRegex.test(aiText)) {
        foundMovie = movie;
        break;
      }
    }

    return { text: aiText, movie: foundMovie };

  } catch (error) {
    return { text: (error as Error).message };
  }
};

export const findMovieByDescription = async (query: string, movies: Movie[]): Promise<Movie | null> => {
    try {
        const movieContext = movies.map(m => `ID: ${m.id}, Title: ${m.title}, Description: ${m.description}, Stars: ${m.stars.join(', ')}`).join('\n');
        const systemInstruction = `You are an expert movie finder. Your task is to find the single best movie match from the provided list based on the user's description.
Respond ONLY with a valid JSON object with a single key "movieId". The value should be the string ID of the best match, or null if no clear match is found.
Example: {"movieId": "jagun-jagun"}

Movie List:
---
${movieContext}
---`;
        const userPrompt = `User's query: "${query}"`;

        const response = await callAiProxy({
            systemInstruction,
            userPrompt,
            json_mode: true,
        });

        const jsonString = response.text.trim();
        if (jsonString) {
            const parsed = JSON.parse(jsonString);
            if (parsed.movieId) {
                return movies.find(m => m.id === parsed.movieId) || null;
            }
        }
        return null;

    } catch (error) {
        console.error("[findMovieByDescription Error]", error);
        return null;
    }
};

export const getAiRecommendations = async (currentMovie: Movie, movies: Movie[]): Promise<{ movieId: string, reason: string }[] | null> => {
    try {
        const otherMoviesContext = movies
            .filter(m => m.id !== currentMovie.id)
            .map(m => `ID: ${m.id}, Title: ${m.title}, Genre: ${m.genre}, Category: ${m.category}, Description: ${m.description}`)
            .join('\n');

        const systemInstruction = `You are a movie recommendation expert for Yoruba Cinemax. Based on the movie the user is currently viewing, recommend 3 other relevant movies from the provided list. For each recommendation, provide a short, compelling reason (max 20 words).
Respond ONLY with a valid JSON object with a single key "recommendations", which is an array of objects. Each object should have "movieId" (string) and "reason" (string) keys.
Example: {"recommendations": [{"movieId": "anikalupo", "reason": "A similar epic fantasy with a powerful story."}]}

Current Movie:
Title: ${currentMovie.title}
Description: ${currentMovie.description}

Available Movies for Recommendation:
---
${otherMoviesContext}
---`;
        const userPrompt = `Please give me 3 recommendations based on ${currentMovie.title}.`;

        const response = await callAiProxy({
            systemInstruction,
            userPrompt,
            json_mode: true,
        });

        console.log('[getAiRecommendations] Response received:', response);
        console.log('[getAiRecommendations] Response text:', response.text);

        const jsonString = response.text?.trim();
        if (!jsonString) {
            console.error('[getAiRecommendations] No text in response, full response:', response);
            return null;
        }
        
        try {
            const parsed = JSON.parse(jsonString);
            console.log('[getAiRecommendations] Parsed successfully:', parsed);
            return parsed.recommendations || null;
        } catch (parseError) {
            console.error('[getAiRecommendations] JSON parse error:', parseError);
            console.error('[getAiRecommendations] Failed to parse:', jsonString.substring(0, 200));
            return null;
        }

    } catch (error) {
        console.error("[getAiRecommendations Error] Full details:", {
            error,
            message: (error as Error)?.message,
            stack: (error as Error)?.stack,
            type: error?.constructor?.name
        });
        return null;
    }
};

export const getAiPersonalizedRecommendations = async (viewingHistory: {movieId: string, viewedAt: string}[], movies: Movie[]): Promise<{ movieId: string }[] | null> => {
    if (viewingHistory.length === 0) return null;
    try {
        const historyMovies = viewingHistory.map(h => movies.find(m => m.id === h.movieId)).filter(Boolean);
        if (historyMovies.length === 0) return null;

        const historyContext = historyMovies.map(m => `Title: ${m!.title}, Genre: ${m!.genre}, Description: ${m!.description}`).join('\n');
        const availableMoviesContext = movies
            .filter(m => !viewingHistory.some(h => h.movieId === m.id))
            .map(m => `ID: ${m.id}, Title: ${m.title}, Genre: ${m.genre}, Category: ${m.category}`)
            .join('\n');

        if (!availableMoviesContext) return null;

        const systemInstruction = `You are a personalized movie recommendation engine. Based on the user's viewing history, recommend 5 movies from the "Available Movies" list that they would likely enjoy.
Respond ONLY with a valid JSON object with a single key "recommendations", which is an array of objects. Each object must have a single key "movieId".
Example: {"recommendations": [{"movieId": "anikalupo"}, {"movieId": "ile-owo"}]}

User's Viewing History:
---
${historyContext}
---

Available Movies for Recommendation:
---
${availableMoviesContext}
---`;
        const userPrompt = `Give me 5 personalized recommendations.`;

        const response = await callAiProxy({
            systemInstruction,
            userPrompt,
            json_mode: true,
        });

        console.log('[getAiPersonalizedRecommendations] Response:', response);

        const jsonString = response.text?.trim();
        if (jsonString) {
            const parsed = JSON.parse(jsonString);
            console.log('[getAiPersonalizedRecommendations] Parsed:', parsed);
            return parsed.recommendations || null;
        }
        console.log('[getAiPersonalizedRecommendations] No text in response');
        return null;

    } catch (error) {
        console.error("[getAiPersonalizedRecommendations Error]", error);
        return null;
    }
};