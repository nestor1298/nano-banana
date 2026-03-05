"use client";

import { MODELS } from "@/lib/constants";
import type { GeminiModel } from "@/lib/types";

interface ModelSelectorProps {
  value: GeminiModel;
  onChange: (value: GeminiModel) => void;
}

export default function ModelSelector({ value, onChange }: ModelSelectorProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor="model" className="text-sm font-medium text-gray-300">
        Model
      </label>
      <select
        id="model"
        value={value}
        onChange={(e) => onChange(e.target.value as GeminiModel)}
        className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2.5 text-sm text-gray-100 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20"
      >
        {MODELS.map((model) => (
          <option key={model.id} value={model.id}>
            {model.name} — {model.description}
          </option>
        ))}
      </select>
    </div>
  );
}
