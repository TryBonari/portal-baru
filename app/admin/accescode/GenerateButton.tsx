"use client";

import { useTransition } from "react";
import { generateAccessCodes } from "./actions";

export default function GenerateButton() {
  const [isPending, startTransition] = useTransition();

  const handleGenerate = (count: number) => {
    startTransition(async () => {
      await generateAccessCodes(count);
    });
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleGenerate(1)}
        disabled={isPending}
        className="px-4 py-2 bg-emerald-900 text-white rounded-md text-sm font-medium hover:bg-emerald-800 disabled:opacity-50 transition"
      >
        {isPending ? "Generating..." : "+ Generate 1 Code"}
      </button>
      <button
        onClick={() => handleGenerate(10)}
        disabled={isPending}
        className="px-4 py-2 border border-stone-300 text-stone-700 bg-white rounded-md text-sm font-medium hover:bg-stone-50 disabled:opacity-50 transition"
      >
        + Generate 10 Codes
      </button>
    </div>
  );
}
