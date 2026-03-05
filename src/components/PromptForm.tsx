"use client";

import { MAX_PROMPT_LENGTH, MAX_BATCH_SIZE, PROMPT_PLACEHOLDER } from "@/lib/constants";
import type { GeminiModel, AspectRatio } from "@/lib/types";
import ModelSelector from "./ModelSelector";
import AspectRatioPicker from "./AspectRatioPicker";

interface PromptFormProps {
  prompts: string;
  onPromptsChange: (value: string) => void;
  model: GeminiModel;
  onModelChange: (value: GeminiModel) => void;
  aspectRatio: AspectRatio;
  onAspectRatioChange: (value: AspectRatio) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  progress: { completed: number; total: number; errors: number } | null;
}

function getPromptCount(text: string): number {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean).length;
}

export default function PromptForm({
  prompts,
  onPromptsChange,
  model,
  onModelChange,
  aspectRatio,
  onAspectRatioChange,
  onGenerate,
  isGenerating,
  progress,
}: PromptFormProps) {
  const promptCount = getPromptCount(prompts);
  const isTooMany = promptCount > MAX_BATCH_SIZE;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      if (!isGenerating && promptCount > 0 && !isTooMany) {
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
            htmlFor="prompts"
            className="text-sm font-medium text-gray-300"
          >
            Prompts{" "}
            <span className="text-gray-500">(one per line)</span>
          </label>
          <textarea
            id="prompts"
            value={prompts}
            onChange={(e) => onPromptsChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={PROMPT_PLACEHOLDER}
            rows={6}
            className="w-full resize-y rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-gray-100 placeholder-gray-500 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20"
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span
                className={`text-xs font-medium ${
                  isTooMany ? "text-red-400" : promptCount > 0 ? "text-yellow-400" : "text-gray-500"
                }`}
              >
                {promptCount} prompt{promptCount !== 1 ? "s" : ""} queued
              </span>
              {isTooMany && (
                <span className="text-xs text-red-400">
                  (max {MAX_BATCH_SIZE})
                </span>
              )}
            </div>
            <span className="text-xs text-gray-500">
              Max {MAX_PROMPT_LENGTH} chars per prompt
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

        {/* Progress bar */}
        {isGenerating && progress && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">
                Generating {progress.completed + progress.errors}/{progress.total} images...
              </span>
              <span className="text-gray-500">
                {progress.errors > 0 && (
                  <span className="text-red-400">{progress.errors} failed</span>
                )}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-gray-800">
              <div
                className="h-full rounded-full bg-yellow-500 transition-all duration-300"
                style={{
                  width: `${((progress.completed + progress.errors) / progress.total) * 100}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Generate button */}
        <button
          onClick={onGenerate}
          disabled={isGenerating || promptCount === 0 || isTooMany}
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
              Generating Batch...
            </>
          ) : (
            <>
              <span>
                Generate {promptCount > 1 ? `${promptCount} Images` : "Image"}
              </span>
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
