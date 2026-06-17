"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { glass } from "@/lib/glass";
import { cn } from "@/lib/cn";

export function SearchBar({
  defaultValue = "",
  className,
  large = false,
}: {
  defaultValue?: string;
  className?: string;
  large?: boolean;
}) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultValue);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn("relative w-full", className)}>
      <div className={cn(glass.input, "flex items-center gap-2 px-4", large ? "py-4" : "py-2.5")}>
        <svg
          className="h-4 w-4 shrink-0 text-white/50"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search wallpapers..."
          className={cn(
            "w-full bg-transparent text-white placeholder:text-white/40 focus:outline-none",
            large ? "text-base" : "text-sm"
          )}
        />
      </div>
    </form>
  );
}
