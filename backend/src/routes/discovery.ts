import { Router } from "express";

import { database } from "../database/database";
import { createSQLiteDiscoveryRepository } from "../services/discovery/sqliteDiscoveryRepository";

import type { DiscoveryRepository } from "../services/discovery/discoveryRepository";

export const createDiscoveryRouter = (
  repository: DiscoveryRepository = createSQLiteDiscoveryRepository(database),
) => {
  const router = Router();

  router.get("/candidates/:id", async (request, response) => {
    try {
      const candidate = await repository.getById(request.params.id);

      if (!candidate) {
        return response.status(404).json({
          error: "Discovery candidate not found",
        });
      }

      return response.status(200).json({
        candidate,
      });
    } catch (error) {
      console.error("Failed to retrieve discovery candidate:", error);

      return response.status(500).json({
        error: "Failed to retrieve discovery candidate",
      });
    }
  });

  return router;
};

export default createDiscoveryRouter();
