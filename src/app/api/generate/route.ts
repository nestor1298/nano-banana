import { NextRequest, NextResponse } from "next/server";
import { generateImage } from "@/lib/gemini";
import { validateGenerateRequest } from "@/lib/validation";
import type { GenerateResponse, GenerateErrorResponse } from "@/lib/types";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest
): Promise<NextResponse<GenerateResponse | GenerateErrorResponse>> {
  try {
    const body = await request.json();
    const validation = validateGenerateRequest(body);

    if (!validation.valid) {
      return NextResponse.json(
        { success: false as const, error: validation.error, code: "INVALID_INPUT" as const },
        { status: 400 }
      );
    }

    const { prompt, model, aspectRatio, userApiKey } = validation.data;

    if (!userApiKey && !process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        {
          success: false as const,
          error: "No API key configured. Add one in Settings or contact the admin.",
          code: "API_KEY_MISSING" as const,
        },
        { status: 500 }
      );
    }

    const result = await generateImage({
      prompt,
      model,
      aspectRatio,
      userApiKey,
    });

    return NextResponse.json({
      success: true as const,
      image: { base64: result.base64, mimeType: result.mimeType },
      prompt,
      model,
      aspectRatio,
      generatedAt: new Date().toISOString(),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";

    if (message.includes("safety") || message.includes("blocked")) {
      return NextResponse.json(
        {
          success: false as const,
          error: "Image blocked by safety filters. Try a different prompt.",
          code: "SAFETY_FILTER" as const,
        },
        { status: 422 }
      );
    }

    if (
      message.includes("429") ||
      message.includes("rate") ||
      message.includes("quota") ||
      message.includes("503") ||
      message.includes("UNAVAILABLE") ||
      message.includes("overloaded") ||
      message.includes("RESOURCE_EXHAUSTED")
    ) {
      return NextResponse.json(
        {
          success: false as const,
          error: "Rate limit exceeded. Please wait and try again.",
          code: "RATE_LIMIT" as const,
        },
        { status: 429 }
      );
    }

    if (
      message.includes("API key") ||
      message.includes("401") ||
      message.includes("403")
    ) {
      return NextResponse.json(
        {
          success: false as const,
          error: "Invalid API key. Check your key and try again.",
          code: "API_ERROR" as const,
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false as const, error: message, code: "UNKNOWN" as const },
      { status: 500 }
    );
  }
}
