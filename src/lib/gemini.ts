import "server-only";
import { GoogleGenAI } from "@google/genai";

function createClient(userApiKey?: string): GoogleGenAI {
  const apiKey = userApiKey || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("No API key available");
  }
  return new GoogleGenAI({ apiKey });
}

export async function generateImage(params: {
  prompt: string;
  model: string;
  aspectRatio: string;
  userApiKey?: string;
}): Promise<{ base64: string; mimeType: string }> {
  const ai = createClient(params.userApiKey);

  const response = await ai.models.generateContent({
    model: params.model,
    contents: params.prompt,
    config: {
      responseModalities: ["IMAGE"],
      imageConfig: {
        aspectRatio: params.aspectRatio,
      },
    },
  });

  // Extract image from response
  const parts = response.candidates?.[0]?.content?.parts;
  if (!parts) {
    throw new Error("No response parts returned");
  }

  for (const part of parts) {
    if (part.inlineData) {
      return {
        base64: part.inlineData.data!,
        mimeType: part.inlineData.mimeType || "image/png",
      };
    }
  }

  throw new Error(
    "No image was generated. The prompt may have been blocked by safety filters."
  );
}
