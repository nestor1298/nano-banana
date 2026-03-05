"use client";

import { ASPECT_RATIOS } from "@/lib/constants";
import type { AspectRatio } from "@/lib/types";

interface AspectRatioPickerProps {
  value: AspectRatio;
  onChange: (value: AspectRatio) => void;
}

// Visual aspect ratio preview boxes
const RATIO_DIMENSIONS: Record<AspectRatio, { w: number; h: number }> = {
  "1:1": { w: 16, h: 16 },
  "16:9": { w: 20, h: 11 },
  "9:16": { w: 11, h: 20 },
  "4:3": { w: 18, h: 14 },
  "3:4": { w: 14, h: 18 },
};

export default function AspectRatioPicker({
  value,
  onChange,
}: AspectRatioPickerProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-gray-300">Aspect Ratio</span>
      <div className="flex flex-wrap gap-2">
        {ASPECT_RATIOS.map((ratio) => {
          const dims = RATIO_DIMENSIONS[ratio.value];
          const isSelected = value === ratio.value;
          return (
            <button
              key={ratio.value}
              onClick={() => onChange(ratio.value)}
              className={`flex flex-col items-center gap-1 rounded-lg border px-3 py-2 transition-all ${
                isSelected
                  ? "border-yellow-500 bg-yellow-500/10 text-yellow-400"
                  : "border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600 hover:text-gray-300"
              }`}
            >
              <div
                className={`rounded-sm border ${
                  isSelected ? "border-yellow-500/60" : "border-gray-600"
                }`}
                style={{ width: dims.w, height: dims.h }}
              />
              <span className="text-xs font-medium">{ratio.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
