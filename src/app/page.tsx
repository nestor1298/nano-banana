"use client";

import { useState } from "react";
import { DEFAULT_MODEL, DEFAULT_ASPECT_RATIO } from "@/lib/constants";
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
import LoadingSpinner from "@/components/LoadingSpinner";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState<GeminiModel>(DEFAULT_MODEL);
  const [aspectRatio, setAspectRatio] =
    useState<AspectRatio>(DEFAULT_ASPECT_RATIO);
  const [userApiKey, setUserApiKey] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [showSettings, setShowSettings] = useState(false);

  async function handleGenerate() {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);
    setError(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt.trim(),
          model,
          aspectRatio,
          ...(userApiKey.trim() ? { userApiKey: userApiKey.trim() } : {}),
        }),
      });

      const data: GenerateResponse | GenerateErrorResponse = await res.json();

      if (!data.success) {
        setError(data.error);
        return;
      }

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
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsGenerating(false);
    }
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
          prompt={prompt}
          onPromptChange={setPrompt}
          model={model}
          onModelChange={setModel}
          aspectRatio={aspectRatio}
          onAspectRatioChange={setAspectRatio}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
        />

        {/* Error message */}
        {error && (
          <div
            role="alert"
            className="mt-4 flex items-start gap-3 rounded-lg border border-red-500/20 bg-red-500/10 p-4"
          >
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
              <p className="text-sm text-red-300">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="shrink-0 text-red-400 hover:text-red-300"
              aria-label="Dismiss error"
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
        )}

        {isGenerating && <LoadingSpinner />}

        <ImageGallery images={images} />
      </main>
    </div>
  );
}
