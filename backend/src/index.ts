import "dotenv/config";
import cors from "cors";
import express from "express";

import assistantRouter from "./routes/assistant";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use("/api/assistant", assistantRouter);
app.get("/api/health", (_request, response) => {
  response.json({
    status: "ok",
    message: "Wegweiser backend is running",
  });
});

app.listen(PORT, () => {
  console.log(`Wegweiser backend is running on port ${PORT}`);
});
