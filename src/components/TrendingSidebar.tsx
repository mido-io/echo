import { getTrendingHashtags } from "@/app/actions/trending";
import Link from "next/link";

export async function TrendingSidebar() {
  const trending = await getTrendingHashtags();

  return (
    <div className="sticky top-24 w-full">
      <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 p-5">
        <h3 className="font-semibold text-zinc-900 mb-4 text-base flex items-center gap-2">
          <svg className="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Trending by AI
        </h3>
        
        {(!trending || trending.length === 0) ? (
          <p className="text-sm text-zinc-500 bg-zinc-50 rounded-lg p-4 text-center">
            No trending topics right now.
          </p>
        ) : (
          <ul className="space-y-4">
            {trending.map((trend: { hashtag: string; count: number }, index: number) => (
              <li key={trend.hashtag || index}>
                <Link href={`/search?q=${encodeURIComponent(trend.hashtag)}`} className="group flex flex-col">
                  <span className="text-zinc-500 text-[11px] font-medium mb-0.5 uppercase tracking-wider">
                    {index + 1} • Trending
                  </span>
                  <span className="font-bold text-zinc-900 group-hover:text-blue-600 transition-colors">
                    {trend.hashtag}
                  </span>
                  <span className="text-zinc-500 text-xs mt-0.5">{trend.count} posts</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <div className="mt-4 text-xs text-zinc-400 px-4">
        Powered by Gemini 1.5 Flash API
      </div>
    </div>
  );
}
