"use client";

import { MODELS } from "@/lib/constants";
import type { GeneratedImage } from "@/lib/types";

interface ImageCardProps {
  image: GeneratedImage;
}

function downloadImage(image: GeneratedImage) {
  const byteCharacters = atob(image.base64);
  const byteNumbers = new Uint8Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const blob = new Blob([byteNumbers], { type: image.mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `nano-banana-${Date.now()}.png`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ImageCard({ image }: ImageCardProps) {
  const modelInfo = MODELS.find((m) => m.id === image.model);

  return (
    <div className="group overflow-hidden rounded-xl border border-gray-800 bg-gray-900 transition-colors hover:border-gray-700">
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-800">
        <img
          src={`data:${image.mimeType};base64,${image.base64}`}
          alt={image.prompt}
          className="w-full object-cover"
        />

        {/* Download overlay */}
        <div className="absolute inset-0 flex items-end justify-end bg-gradient-to-t from-black/60 via-transparent to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={() => downloadImage(image)}
            className="rounded-lg bg-white/90 p-2 text-gray-900 backdrop-blur-sm transition-colors hover:bg-white"
            aria-label="Download image"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Metadata */}
      <div className="p-3">
        <p className="line-clamp-2 text-sm text-gray-300" title={image.prompt}>
          {image.prompt}
        </p>
        <div className="mt-2 flex items-center gap-2">
          <span className="rounded-full bg-yellow-500/10 px-2 py-0.5 text-xs font-medium text-yellow-400">
            {modelInfo?.name ?? image.model}
          </span>
          <span className="text-xs text-gray-500">{image.aspectRatio}</span>
        </div>
      </div>
    </div>
  );
}
