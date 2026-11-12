import { Router } from "express";

const router = Router();

router.post("/", (request, response) => {
  const { message, location, language } = request.body;

  if (!message || typeof message !== "string" || !message.trim()) {
    return response.status(400).json({
      error: "Message is required",
    });
  }

  if (!location?.countryCode || !location?.city) {
    return response.status(400).json({
      error: "Location is required",
    });
  }

  if (!language) {
    return response.status(400).json({
      error: "Language is required",
    });
  }

  // Тимчасова відповідь для перевірки API.
  return response.json({
    status: "received",
    message: "Request received successfully",
    request: {
      message: message.trim(),
      location,
      language,
    },
  });
});

export default router;
