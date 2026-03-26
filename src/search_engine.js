import { search } from 'duck-duck-scrape';

/**
 * Searches the internet for the given topic using duck-duck-scrape (no API key required).
 * Returns a concatenated string of the search results context.
 */
export async function searchInternet(topic) {
    console.log(`🔍 Searching the web for: ${topic}...`);
    try {
        const queryRules = { safeSearch: "moderate" };
        const data = await search(topic, queryRules);
        
        if (!data || !data.results || data.results.length === 0) {
            return "No recent news found for this topic. Generate a general educational reading about it instead.";
        }

        // Extract top 4 results for context
        const topResults = data.results.slice(0, 4);
        const searchContext = topResults.map(r => `Title: ${r.title}\nSnippet: ${r.description}`).join("\n\n");
        return searchContext;
        
    } catch (error) {
        console.error("Search error:", error);
        return "Search failed due to an error. Proceed to generate a reading based on your internal knowledge of the topic.";
    }
}
