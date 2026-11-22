import OpenAI from "openai";

import { getOpenAIClient } from "../openaiClient";

import {
  procedureCategories,
  procedureCategoryIds,
} from "../../../../shared/procedures/index.js";

import type {
  DiscoveryCandidateGenerator,
  DiscoveryCandidateGenerationInput,
} from "./discoveryCandidateGenerator";

interface GeneratedCandidateData {
  categoryId: string;
  title: string;
  description: string;
  region: string;
  deadline: string | null;
  authority: {
    name: string;
    address: string | null;
    phone: string | null;
    email: string | null;
    website: string | null;
  } | null;
  steps: Array<{
    id: string;
    title: string;
    description: string;
    documents: Array<{
      id: string;
      title: string;
      description: string;
      required: boolean;
      condition: string | null;
    }>;
  }>;
  scope: "national" | "state" | "local";
  location: {
    countryCode: string;
    region: string | null;
    city: string | null;
  };
  baseProcedureId: string | null;
  duplicateOf: string | null;
  sourceUrls: string[];
}

const candidateSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "categoryId",
    "title",
    "description",
    "region",
    "deadline",
    "authority",
    "steps",
    "scope",
    "location",
    "baseProcedureId",
    "duplicateOf",
    "sourceUrls",
  ],
  properties: {
    categoryId: { type: "string" },
    title: { type: "string" },
    description: { type: "string" },
    region: { type: "string" },
    deadline: { type: ["string", "null"] },
    authority: {
      type: ["object", "null"],
      additionalProperties: false,
      required: ["name", "address", "phone", "email", "website"],
      properties: {
        name: { type: "string" },
        address: { type: ["string", "null"] },
        phone: { type: ["string", "null"] },
        email: { type: ["string", "null"] },
        website: { type: ["string", "null"] },
      },
    },
    steps: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["id", "title", "description", "documents"],
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          description: { type: "string" },
          documents: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              required: ["id", "title", "description", "required", "condition"],
              properties: {
                id: { type: "string" },
                title: { type: "string" },
                description: { type: "string" },
                required: { type: "boolean" },
                condition: { type: ["string", "null"] },
              },
            },
          },
        },
      },
    },
    scope: {
      type: "string",
      enum: ["national", "state", "local"],
    },
    location: {
      type: "object",
      additionalProperties: false,
      required: ["countryCode", "region", "city"],
      properties: {
        countryCode: { type: "string" },
        region: { type: ["string", "null"] },
        city: { type: ["string", "null"] },
      },
    },
    baseProcedureId: { type: ["string", "null"] },
    duplicateOf: { type: ["string", "null"] },
    sourceUrls: {
      type: "array",
      items: { type: "string" },
    },
  },
} as const;

export const createOpenAIDiscoveryCandidateGenerator = (
  openai?: OpenAI,
): DiscoveryCandidateGenerator => {
  return {
    async generate(input: DiscoveryCandidateGenerationInput) {
      const client = openai ?? getOpenAIClient();

      if (input.sources.length === 0) {
        throw new Error(
          "Cannot generate a discovery candidate without sources.",
        );
      }

      const response = await client.responses.create({
        model: "gpt-5.4-mini",
        input: [
          {
            role: "system",
            content: `
            You are a research assistant for Wegweiser,
            a platform that explains administrative procedures in Germany.

            Create a structured administrative procedure candidate
            using only the supplied search results.

            AVAILABLE PROCEDURE CATEGORIES:
            ${JSON.stringify(
              procedureCategories.map(({ id, title }) => ({ id, title })),
              null,
              2,
            )}

            Rules:
            - categoryId MUST exactly match one of the IDs listed above.
            - Select the most appropriate existing category.
            - Never invent or modify a categoryId.
            - Never invent facts, requirements, deadlines or authorities.
            - Use only information supported by the supplied sources.
            - Never invent URLs.
            - sourceUrls must contain only exact URLs from the supplied sources.
            - Prefer official government and public authority sources.
            - If information is uncertain, do not invent it.
            - Use German for procedure titles and descriptions.
            - Use concise, practical steps.
            - Do not claim that the candidate is verified.
            - Do not invent baseProcedureId or duplicateOf.
            - If no reliable procedure can be described, do not fabricate one.
            `,
          },
          {
            role: "user",
            content: JSON.stringify({
              query: input.query,
              availableSources: input.sources,
            }),
          },
        ],
        text: {
          format: {
            type: "json_schema",
            name: "discovery_candidate",
            strict: true,
            schema: candidateSchema,
          },
        },
      });

      if (response.status !== "completed") {
        throw new Error(
          `Candidate generation did not complete: ${response.status}`,
        );
      }

      if (!response.output_text) {
        throw new Error("OpenAI returned an empty candidate response.");
      }

      let generated: GeneratedCandidateData;

      try {
        generated = JSON.parse(response.output_text) as GeneratedCandidateData;
      } catch {
        throw new Error("OpenAI returned an invalid candidate JSON response.");
      }

      if (!procedureCategoryIds.includes(generated.categoryId)) {
        throw new Error(
          `AI generated an unknown procedure category: ${generated.categoryId}`,
        );
      }

      const availableSources = new Map(
        input.sources.map((source) => [source.url, source]),
      );

      const selectedSources = generated.sourceUrls.map((url) => {
        const source = availableSources.get(url);

        if (!source) {
          throw new Error(
            `Generated candidate references an unknown source: ${url}`,
          );
        }

        return {
          title: source.title,
          url: source.url,
          authority: source.authority,
        };
      });

      if (selectedSources.length === 0) {
        throw new Error("Generated candidate does not reference any sources.");
      }

      const candidate = generated;

      return {
        procedure: {
          categoryId: candidate.categoryId,
          title: candidate.title,
          description: candidate.description,
          region: candidate.region,
          ...(candidate.deadline !== null && {
            deadline: candidate.deadline,
          }),
          ...(candidate.authority !== null && {
            authority: {
              name: candidate.authority.name,
              ...(candidate.authority.address !== null && {
                address: candidate.authority.address,
              }),
              ...(candidate.authority.phone !== null && {
                phone: candidate.authority.phone,
              }),
              ...(candidate.authority.email !== null && {
                email: candidate.authority.email,
              }),
              ...(candidate.authority.website !== null && {
                website: candidate.authority.website,
              }),
            },
          }),
          sources: selectedSources,
          steps: candidate.steps.map((step) => ({
            id: step.id,
            title: step.title,
            description: step.description,
            documents: step.documents.map((document) => ({
              id: document.id,
              title: document.title,
              description: document.description,
              required: document.required,
              ...(document.condition !== null && {
                condition: document.condition,
              }),
            })),
          })),
        },
        scope: candidate.scope,
        location: {
          countryCode: candidate.location.countryCode,
          ...(candidate.location.region !== null && {
            region: candidate.location.region,
          }),
          ...(candidate.location.city !== null && {
            city: candidate.location.city,
          }),
        },
        ...(candidate.baseProcedureId !== null && {
          baseProcedureId: candidate.baseProcedureId,
        }),
        ...(candidate.duplicateOf !== null && {
          duplicateOf: candidate.duplicateOf,
        }),
        originalQuery: input.query.query,
      };
    },
  };
};
