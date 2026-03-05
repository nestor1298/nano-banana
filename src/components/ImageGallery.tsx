"use client";

import type { GeneratedImage } from "@/lib/types";
import ImageCard from "./ImageCard";

interface ImageGalleryProps {
  images: GeneratedImage[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  if (images.length === 0) {
    return (
      <div className="mt-12 flex flex-col items-center justify-center text-center">
        <div className="text-5xl">🍌</div>
        <h3 className="mt-4 text-lg font-medium text-gray-400">
          No images yet
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Enter a prompt above and click Generate to create your first image.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="mb-4 text-sm font-medium text-gray-400">
        Generated Images ({images.length})
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image) => (
          <ImageCard key={image.id} image={image} />
        ))}
      </div>
    </div>
  );
}
