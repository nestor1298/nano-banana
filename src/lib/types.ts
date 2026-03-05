// --- Model definitions ---
export type GeminiModel =
  | "gemini-3.1-flash-image-preview"
  | "gemini-3-pro-image-preview"
  | "gemini-2.5-flash-image";

export type AspectRatio = "1:1" | "16:9" | "9:16" | "4:3" | "3:4";

// --- API request/response ---
export interface GenerateRequest {
  prompt: string;
  model: GeminiModel;
  aspectRatio: AspectRatio;
  userApiKey?: string;
}

export interface GenerateResponse {
  success: true;
  image: {
    base64: string;
    mimeType: string;
  };
  prompt: string;
  model: GeminiModel;
  aspectRatio: AspectRatio;
  generatedAt: string;
}

export interface GenerateErrorResponse {
  success: false;
  error: string;
  code:
    | "INVALID_INPUT"
    | "API_KEY_MISSING"
    | "API_ERROR"
    | "SAFETY_FILTER"
    | "RATE_LIMIT"
    | "UNKNOWN";
}

// --- Client-side state ---
export interface GeneratedImage {
  id: string;
  base64: string;
  mimeType: string;
  prompt: string;
  model: GeminiModel;
  aspectRatio: AspectRatio;
  generatedAt: Date;
}
