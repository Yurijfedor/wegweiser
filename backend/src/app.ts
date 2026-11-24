import cors from "cors";
import express from "express";

import { createAssistantRouter } from "./routes/assistant";
import { createDiscoveryRouter } from "./routes/discovery";

import type { Router } from "express";

export const createApp = (
  assistantRouter: Router = createAssistantRouter(),
) => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use("/api/assistant", assistantRouter);
  app.use("/api/discovery", createDiscoveryRouter());

  app.get("/api/health", (_request, response) => {
    response.json({
      status: "ok",
      message: "Wegweiser backend is running",
    });
  });

  return app;
};

export default createApp();
