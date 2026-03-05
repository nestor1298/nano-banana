"use client";

import { useState, useRef, useCallback } from "react";
import { DEFAULT_MODEL, DEFAULT_ASPECT_RATIO, MAX_PROMPT_LENGTH, MAX_BATCH_SIZE } from "@/lib/constants";
import type {
  GeminiModel,
  AspectRatio,
  GeneratedImage,
  GenerateResponse,
  GenerateErrorResponse,
} from "@/lib/types";
import Header from "@/components/Header";
import ApiKeyInput from "@/components/ApiKeyInput";
import PromptForm from "@/components/PromptForm";
import ImageGallery from "@/components/ImageGallery";

export default function Home() {
  const [stylePrefix, setStylePrefix] = useState("");
  const [prompts, setPrompts] = useState("");
  const [model, setModel] = useState<GeminiModel>(DEFAULT_MODEL);
  const [aspectRatio, setAspectRatio] =
    useState<AspectRatio>(DEFAULT_ASPECT_RATIO);
  const [userApiKey, setUserApiKey] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [progress, setProgress] = useState<{
    completed: number;
    total: number;
    errors: number;
  } | null>(null);

  // Ref to track the current batch ID so we can tag images from same batch
  const batchIdRef = useRef(0);

  const generateSingleImage = useCallback(
    async (prompt: string, apiKey?: string) => {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          model,
          aspectRatio,
          ...(apiKey ? { userApiKey: apiKey } : {}),
        }),
      });

      const data: GenerateResponse | GenerateErrorResponse = await res.json();
      return data;
    },
    [model, aspectRatio]
  );

  async function handleGenerate() {
    const prefix = stylePrefix.trim();
    const promptList = prompts
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .map((p) => (prefix ? `${prefix}, ${p}` : p));

    if (promptList.length === 0 || isGenerating) return;
    if (promptList.length > MAX_BATCH_SIZE) return;

    // Validate individual prompt lengths
    const tooLong = promptList.find((p) => p.length > MAX_PROMPT_LENGTH);
    if (tooLong) {
      setErrors([
        `Prompt too long (${tooLong.length} chars): "${tooLong.slice(0, 50)}..." — max is ${MAX_PROMPT_LENGTH}.`,
      ]);
      return;
    }

    setIsGenerating(true);
    setErrors([]);
    setProgress({ completed: 0, total: promptList.length, errors: 0 });
    batchIdRef.current += 1;

    const batchErrors: string[] = [];
    const apiKey = userApiKey.trim() || undefined;

    // Fire all prompts in parallel using Promise.allSettled
    const promises = promptList.map(async (prompt, index) => {
      try {
        const data = await generateSingleImage(prompt, apiKey);

        if (!data.success) {
          batchErrors.push(`#${index + 1} "${prompt.slice(0, 40)}...": ${data.error}`);
          setProgress((prev) =>
            prev ? { ...prev, errors: prev.errors + 1 } : null
          );
          return;
        }

        // Image completed — add it to gallery immediately
        const newImage: GeneratedImage = {
          id: crypto.randomUUID(),
          base64: data.image.base64,
          mimeType: data.image.mimeType,
          prompt: data.prompt,
          model: data.model,
          aspectRatio: data.aspectRatio,
          generatedAt: new Date(data.generatedAt),
        };

        setImages((prev) => [newImage, ...prev]);
        setProgress((prev) =>
          prev ? { ...prev, completed: prev.completed + 1 } : null
        );
      } catch {
        batchErrors.push(
          `#${index + 1} "${prompt.slice(0, 40)}...": Network error`
        );
        setProgress((prev) =>
          prev ? { ...prev, errors: prev.errors + 1 } : null
        );
      }
    });

    await Promise.allSettled(promises);

    if (batchErrors.length > 0) {
      setErrors(batchErrors);
    }

    setIsGenerating(false);
    setProgress(null);
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Header
        showSettings={showSettings}
        onToggleSettings={() => setShowSettings(!showSettings)}
      />

      {showSettings && (
        <ApiKeyInput value={userApiKey} onChange={setUserApiKey} />
      )}

      <main className="mx-auto max-w-5xl px-4 py-8">
        <PromptForm
          stylePrefix={stylePrefix}
          onStylePrefixChange={setStylePrefix}
          prompts={prompts}
          onPromptsChange={setPrompts}
          model={model}
          onModelChange={setModel}
          aspectRatio={aspectRatio}
          onAspectRatioChange={setAspectRatio}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
          progress={progress}
        />

        {/* Error messages */}
        {errors.length > 0 && (
          <div
            role="alert"
            className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mt-0.5 shrink-0 text-red-400"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-300">
                    {errors.length} prompt{errors.length !== 1 ? "s" : ""} failed:
                  </p>
                  <ul className="mt-1 space-y-1">
                    {errors.map((err, i) => (
                      <li key={i} className="text-xs text-red-300/80">
                        {err}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <button
                onClick={() => setErrors([])}
                className="shrink-0 text-red-400 hover:text-red-300"
                aria-label="Dismiss errors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        )}

        <ImageGallery images={images} />
      </main>
    </div>
  );
}
