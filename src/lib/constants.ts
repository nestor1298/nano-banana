import type { GeminiModel, AspectRatio } from "./types";

export const MODELS: { id: GeminiModel; name: string; description: string }[] =
  [
    {
      id: "gemini-3.1-flash-image-preview",
      name: "Nano Banana 2 (Flash)",
      description: "Fastest. High quality, lightning-fast generation.",
    },
    {
      id: "gemini-3-pro-image-preview",
      name: "Nano Banana Pro",
      description: "Highest quality. Complex reasoning, native 4K.",
    },
    {
      id: "gemini-2.5-flash-image",
      name: "Nano Banana 1 (Original)",
      description: "Original model. Reliable and fast.",
    },
  ];

export const ASPECT_RATIOS: {
  value: AspectRatio;
  label: string;
}[] = [
  { value: "1:1", label: "Square" },
  { value: "16:9", label: "Landscape" },
  { value: "9:16", label: "Portrait" },
  { value: "4:3", label: "Standard" },
  { value: "3:4", label: "Tall" },
];

export const DEFAULT_MODEL: GeminiModel = "gemini-3.1-flash-image-preview";
export const DEFAULT_ASPECT_RATIO: AspectRatio = "1:1";
export const MAX_PROMPT_LENGTH = 2000;
export const PROMPT_PLACEHOLDER =
  "Describe the image you want to generate...";
