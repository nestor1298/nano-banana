import { MODELS, ASPECT_RATIOS, MAX_PROMPT_LENGTH } from "./constants";
import type { GenerateRequest } from "./types";

export function validateGenerateRequest(
  body: unknown
):
  | { valid: true; data: GenerateRequest }
  | { valid: false; error: string } {
  if (!body || typeof body !== "object") {
    return { valid: false, error: "Request body must be a JSON object." };
  }

  const obj = body as Record<string, unknown>;

  // Validate prompt
  if (typeof obj.prompt !== "string" || !obj.prompt.trim()) {
    return { valid: false, error: "Prompt is required and must be a non-empty string." };
  }
  const prompt = obj.prompt.trim();
  if (prompt.length > MAX_PROMPT_LENGTH) {
    return {
      valid: false,
      error: `Prompt must be ${MAX_PROMPT_LENGTH} characters or fewer.`,
    };
  }

  // Validate model
  if (typeof obj.model !== "string") {
    return { valid: false, error: "Model is required." };
  }
  const validModels = MODELS.map((m) => m.id);
  if (!validModels.includes(obj.model as GenerateRequest["model"])) {
    return { valid: false, error: `Invalid model. Must be one of: ${validModels.join(", ")}` };
  }

  // Validate aspect ratio
  if (typeof obj.aspectRatio !== "string") {
    return { valid: false, error: "Aspect ratio is required." };
  }
  const validRatios = ASPECT_RATIOS.map((r) => r.value);
  if (!validRatios.includes(obj.aspectRatio as GenerateRequest["aspectRatio"])) {
    return { valid: false, error: `Invalid aspect ratio. Must be one of: ${validRatios.join(", ")}` };
  }

  // Validate optional user API key
  if (obj.userApiKey !== undefined && typeof obj.userApiKey !== "string") {
    return { valid: false, error: "User API key must be a string if provided." };
  }
  const userApiKey = typeof obj.userApiKey === "string" && obj.userApiKey.trim()
    ? obj.userApiKey.trim()
    : undefined;

  return {
    valid: true,
    data: {
      prompt,
      model: obj.model as GenerateRequest["model"],
      aspectRatio: obj.aspectRatio as GenerateRequest["aspectRatio"],
      userApiKey,
    },
  };
}
