"use client";

export default function LoadingSpinner() {
  return (
    <div className="mt-8 flex flex-col items-center justify-center gap-3">
      <div className="relative h-12 w-12">
        <div className="absolute inset-0 animate-ping rounded-full bg-yellow-500/20" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-700 border-t-yellow-500" />
        </div>
      </div>
      <p className="text-sm text-gray-400">
        Generating your image... This may take 15-30 seconds.
      </p>
    </div>
  );
}
