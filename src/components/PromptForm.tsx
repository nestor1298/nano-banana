"use client";

import { MAX_PROMPT_LENGTH, PROMPT_PLACEHOLDER } from "@/lib/constants";
import type { GeminiModel, AspectRatio } from "@/lib/types";
import ModelSelector from "./ModelSelector";
import AspectRatioPicker from "./AspectRatioPicker";

interface PromptFormProps {
  prompt: string;
  onPromptChange: (value: string) => void;
  model: GeminiModel;
  onModelChange: (value: GeminiModel) => void;
  aspectRatio: AspectRatio;
  onAspectRatioChange: (value: AspectRatio) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export default function PromptForm({
  prompt,
  onPromptChange,
  model,
  onModelChange,
  aspectRatio,
  onAspectRatioChange,
  onGenerate,
  isGenerating,
}: PromptFormProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      if (!isGenerating && prompt.trim()) {
        onGenerate();
      }
    }
  };

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
      <div className="flex flex-col gap-4">
        {/* Prompt textarea */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="prompt"
            className="text-sm font-medium text-gray-300"
          >
            Prompt
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={PROMPT_PLACEHOLDER}
            rows={3}
            maxLength={MAX_PROMPT_LENGTH}
            className="w-full resize-none rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-gray-100 placeholder-gray-500 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20"
          />
          <div className="flex justify-end">
            <span className="text-xs text-gray-500">
              {prompt.length}/{MAX_PROMPT_LENGTH}
            </span>
          </div>
        </div>

        {/* Model + Aspect Ratio row */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex-1">
            <ModelSelector value={model} onChange={onModelChange} />
          </div>
          <div className="flex-1">
            <AspectRatioPicker value={aspectRatio} onChange={onAspectRatioChange} />
          </div>
        </div>

        {/* Generate button */}
        <button
          onClick={onGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-yellow-500 px-6 py-3 font-semibold text-gray-900 transition-colors hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <svg
                className="h-5 w-5 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Generating...
            </>
          ) : (
            <>
              <span>Generate Image</span>
              <kbd className="hidden rounded border border-gray-600 bg-gray-800/50 px-1.5 py-0.5 text-xs text-gray-400 sm:inline-block">
                {typeof navigator !== "undefined" &&
                navigator.platform?.includes("Mac")
                  ? "Cmd"
                  : "Ctrl"}
                +Enter
              </kbd>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
