"use client";

import { useState } from "react";

interface ApiKeyInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ApiKeyInput({ value, onChange }: ApiKeyInputProps) {
  const [showKey, setShowKey] = useState(false);

  return (
    <div className="border-b border-gray-800 bg-gray-900/50">
      <div className="mx-auto max-w-5xl px-4 py-4">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="api-key"
            className="text-sm font-medium text-gray-300"
          >
            Your Gemini API Key{" "}
            <span className="text-gray-500">(optional)</span>
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                id="api-key"
                type={showKey ? "text" : "password"}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Enter your Gemini API key..."
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 pr-20 text-sm text-gray-100 placeholder-gray-500 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-xs text-gray-400 hover:text-gray-200"
              >
                {showKey ? "Hide" : "Show"}
              </button>
            </div>
            {value && (
              <button
                onClick={() => onChange("")}
                className="rounded-lg border border-gray-700 px-3 py-2 text-sm text-gray-400 hover:border-gray-600 hover:text-gray-200"
              >
                Clear
              </button>
            )}
          </div>
          <p className="text-xs text-gray-500">
            Your key is sent per-request and never stored on our servers. Get a
            free key from{" "}
            <a
              href="https://aistudio.google.com/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-yellow-500 hover:text-yellow-400 underline"
            >
              Google AI Studio
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
