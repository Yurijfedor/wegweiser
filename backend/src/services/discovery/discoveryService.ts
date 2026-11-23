import { randomUUID } from "node:crypto";

import { createOpenAIDiscoverySourceProvider } from "./openAiDiscoverySourceProvider";
import { createOpenAIDiscoveryCandidateGenerator } from "./openAiDiscoveryCandidateGenerator";
import { createInMemoryDiscoveryRepository } from "./inMemoryDiscoveryRepository";
import { validateDiscoveryCandidateBusinessRules } from "./discoveryCandidateValidator";
import { createDiscoveryDuplicateChecker } from "./discoveryDuplicateChecker";

import type { DiscoveryCandidate } from "./discoveryCandidate";
import type { DiscoveryRepository } from "./discoveryRepository";
import type { DiscoverySourceProvider } from "./discoverySourceProvider";
import type { DiscoveryCandidateGenerator } from "./discoveryCandidateGenerator";
import type { ConversationMessage } from "../../types/assistant";

export interface DiscoveryServiceInput {
  conversation: ConversationMessage[];
  location: {
    countryCode: string;
    city: string;
    region?: string;
  };
}

export type DiscoveryServiceResult =
  | {
      status: "candidate_created";
      candidateId: string;
      candidate: DiscoveryCandidate;
    }
  | {
      status: "duplicate_found";
      duplicateOf: string;
      duplicateType: "catalog" | "candidate";
    }
  | {
      status: "not_found";
    };

export interface DiscoveryServiceDependencies {
  sourceProvider?: DiscoverySourceProvider;
  candidateGenerator?: DiscoveryCandidateGenerator;
  repository?: DiscoveryRepository;
}

export interface DiscoveryService {
  discover(input: DiscoveryServiceInput): Promise<DiscoveryServiceResult>;
}

export const createDiscoveryService = (
  dependencies: DiscoveryServiceDependencies = {},
): DiscoveryService => {
  const sourceProvider =
    dependencies.sourceProvider ?? createOpenAIDiscoverySourceProvider();

  const candidateGenerator =
    dependencies.candidateGenerator ??
    createOpenAIDiscoveryCandidateGenerator();

  const repository =
    dependencies.repository ?? createInMemoryDiscoveryRepository();

  const duplicateChecker = createDiscoveryDuplicateChecker(repository);

  return {
    async discover(input) {
      const userMessages = input.conversation
        .filter((message) => message.role === "user")
        .slice(-3);

      const currentMessage = userMessages.at(-1);

      if (!currentMessage) {
        throw new Error("Discovery requires at least one user message.");
      }

      const context = userMessages
        .slice(0, -1)
        .map((message) => message.content)
        .join("\n");

      const query = context
        ? `${context}\n${currentMessage.content}`
        : currentMessage.content;

      const sourceQuery = {
        query,
        countryCode: input.location.countryCode,
        city: input.location.city,
        ...(input.location.region && {
          region: input.location.region,
        }),
      };

      const sources = await sourceProvider.search(sourceQuery);

      if (sources.length === 0) {
        return { status: "not_found" };
      }

      const generated = await candidateGenerator.generate({
        query: sourceQuery,
        sources,
      });

      const candidate: DiscoveryCandidate = {
        ...generated,
        procedure: {
          ...generated.procedure,
          verification: {
            status: "unverified",
          },
        },
        id: randomUUID(),
        createdAt: new Date().toISOString(),
        status: "pending_review",
        discoveredBy: "ai",
      };

      const validation = validateDiscoveryCandidateBusinessRules(candidate);

      if (!validation.valid) {
        throw new Error(
          `Discovery candidate validation failed: ${validation.errors.join("; ")}`,
        );
      }

      const duplicateResult = await duplicateChecker.check(candidate);

      if (duplicateResult.isDuplicate) {
        return {
          status: "duplicate_found",
          duplicateOf: duplicateResult.duplicateOf,
          duplicateType: duplicateResult.reason,
        };
      }

      await repository.add(candidate);

      return {
        status: "candidate_created",
        candidateId: candidate.id,
        candidate,
      };
    },
  };
};
