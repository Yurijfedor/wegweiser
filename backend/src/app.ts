import cors from "cors";
import express from "express";

import { createAssistantRouter } from "./routes/assistant";

import type { Router } from "express";

export const createApp = (
  assistantRouter: Router = createAssistantRouter(),
) => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use("/api/assistant", assistantRouter);

  app.get("/api/health", (_request, response) => {
    response.json({
      status: "ok",
      message: "Wegweiser backend is running",
    });
  });

  return app;
};

export default createApp();
