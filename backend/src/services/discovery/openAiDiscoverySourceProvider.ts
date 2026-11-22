import OpenAI from "openai";

import { getOpenAIClient } from "../openaiClient";

import type {
  DiscoverySourceProvider,
  DiscoverySourceQuery,
  DiscoverySourceResult,
} from "./discoverySourceProvider";

interface WebSearchResult {
  title?: string;
  url?: string;
  snippet?: string;
}

interface WebSearchOutputItem {
  type?: string;
  results?: WebSearchResult[];
}

const isValidHttpUrl = (value: string): boolean => {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
};

export const createOpenAIDiscoverySourceProvider = (
  openai?: OpenAI,
): DiscoverySourceProvider => ({
  async search(input: DiscoverySourceQuery): Promise<DiscoverySourceResult[]> {
    const client = openai ?? getOpenAIClient();

    const location = [input.city, input.region, input.countryCode]
      .filter(Boolean)
      .join(", ");

    const response = await client.responses.create({
      model: "gpt-5.4-mini",
      tools: [
        {
          type: "web_search",
        },
      ],
      tool_choice: "required",
      include: ["web_search_call.results"],
      input: `
          Search the web for official sources about this
          German administrative procedure:

          Query: ${input.query}
          Location: ${location}

          Prefer official government and public authority websites.
          Search in German where appropriate.

          Do not invent sources or URLs.
          Return search results only.
        `,
    });

    const output = response.output as unknown as WebSearchOutputItem[];

    const results = output
      .filter((item) => item.type === "web_search_call")
      .flatMap((item) => item.results ?? []);

    const uniqueResults = new Map<string, DiscoverySourceResult>();

    for (const result of results) {
      if (!result.title || !result.url || !isValidHttpUrl(result.url)) {
        continue;
      }

      if (uniqueResults.has(result.url)) {
        continue;
      }

      const url = new URL(result.url);

      uniqueResults.set(result.url, {
        title: result.title,
        url: result.url,
        authority: url.hostname,
        snippet: result.snippet,
      });
    }

    return [...uniqueResults.values()];
  },
});
