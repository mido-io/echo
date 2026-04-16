import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q || "";
  
  let results: any[] = [];
  
  if (query) {
    const supabase = await createClient();
    
    const { data } = await supabase
      .from("profiles")
      .select("handle, display_name, bio")
      .or(`handle.ilike.%${query}%,display_name.ilike.%${query}%`)
      .limit(20);
      
    if (data) {
      results = data;
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 mb-6">
          Search Results {query && `for "${query}"`}
        </h2>
        
        {!query && (
          <p className="text-sm text-zinc-500 bg-white p-6 rounded-lg border border-zinc-100 shadow-sm">
            Enter a search term above to find users.
          </p>
        )}
        
        {query && results.length === 0 && (
          <p className="text-sm text-zinc-500 bg-white p-6 rounded-lg border border-zinc-100 shadow-sm">
            No users found matching "{query}".
          </p>
        )}
        
        {results.length > 0 && (
          <div className="bg-white rounded-lg border border-zinc-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden divide-y divide-zinc-100">
            {results.map((profile) => (
              <div key={profile.handle || Math.random()} className="p-4 hover:bg-zinc-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-base font-medium text-zinc-900">
                      {profile.display_name || "Anonymous"}
                    </p>
                    <p className="text-sm text-zinc-500">
                      @{profile.handle || "unknown"}
                    </p>
                  </div>
                  <div className="text-xs font-medium border border-zinc-200 bg-white px-3 py-1.5 rounded-full text-zinc-600 shadow-sm">
                    View
                  </div>
                </div>
                {profile.bio && (
                  <p className="mt-3 text-sm text-zinc-600 line-clamp-2">
                    {profile.bio}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
