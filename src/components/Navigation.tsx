"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function Navigation() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-bold tracking-tighter text-zinc-900">
          Echo.
        </Link>
        <div className="flex flex-1 items-center justify-end gap-4 sm:gap-6">
          <form onSubmit={handleSearch} className="relative w-full max-w-[200px] sm:max-w-xs">
            <input
              type="text"
              name="searchQuery"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="w-full rounded-full border border-zinc-300 bg-zinc-50 py-1.5 pl-4 pr-10 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 transition-colors"
            />
            <button
              type="submit"
              className="absolute right-0 top-0 mt-1.5 mr-3 text-zinc-400 hover:text-zinc-600"
              aria-label="Search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>
          <Link href="/profile" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors whitespace-nowrap">
            Profile
          </Link>
        </div>
      </div>
    </nav>
  );
}
