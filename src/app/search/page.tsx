import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { TrendingSidebar } from "@/components/TrendingSidebar";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q || "";
  
  let userResults: any[] = [];
  let postResults: any[] = [];
  
  if (query) {
    const supabase = await createClient();
    
    const [usersResponse, postsResponse] = await Promise.all([
      supabase
        .from("profiles")
        .select("id, handle, display_name, bio, avatar_url")
        .or(`handle.ilike.%${query}%,display_name.ilike.%${query}%`)
        .limit(10),
      supabase
        .from("posts")
        .select(`
          id, 
          content, 
          created_at, 
          profiles (handle, display_name, avatar_url)
        `)
        .ilike("content", `%${query}%`)
        .order("created_at", { ascending: false })
        .limit(20)
    ]);
      
    if (usersResponse.data) userResults = usersResponse.data;
    if (postsResponse.data) postResults = postsResponse.data;
  }

  return (
    <div className="flex min-h-screen bg-zinc-50 mx-auto max-w-7xl">
      <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-2xl w-full mx-auto border-r border-zinc-200/50 bg-white">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 mb-6">
          Search Results {query && `for "${query}"`}
        </h2>
        
        {!query && (
          <p className="text-sm text-zinc-500 bg-zinc-50 p-6 rounded-lg border border-zinc-100 shadow-sm text-center">
            Enter a search term above to find users and posts.
          </p>
        )}
        
        {query && userResults.length === 0 && postResults.length === 0 && (
          <p className="text-sm text-zinc-500 bg-zinc-50 p-6 rounded-lg border border-zinc-100 shadow-sm text-center">
            No results found matching "{query}".
          </p>
        )}
        
        {query && (userResults.length > 0 || postResults.length > 0) && (
          <div className="space-y-8">
            {/* Users Section */}
            {userResults.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-zinc-900 mb-3 px-1">Users</h3>
                <div className="rounded-2xl border border-zinc-100 shadow-sm overflow-hidden divide-y divide-zinc-100">
                  {userResults.map((profile) => (
                    <Link href={`/${profile.handle}`} key={profile.id} className="block p-4 hover:bg-zinc-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-zinc-200 overflow-hidden shrink-0">
                          {profile.avatar_url && <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-medium text-zinc-900 truncate">
                            {profile.display_name || "Anonymous"}
                          </p>
                          <p className="text-sm text-zinc-500 truncate">
                            @{profile.handle || "unknown"}
                          </p>
                        </div>
                      </div>
                      {profile.bio && (
                        <p className="mt-2 text-sm text-zinc-600 line-clamp-2">
                          {profile.bio}
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Posts Section */}
            {postResults.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-zinc-900 mb-3 px-1">Posts</h3>
                <div className="rounded-2xl border border-zinc-100 shadow-sm bg-white overflow-hidden divide-y divide-zinc-100">
                  {postResults.map((post) => (
                    <div data-testid="post-result" key={post.id} className="p-4 hover:bg-zinc-50 transition-colors">
                      <div className="flex items-start gap-3">
                        <Link href={`/${post.profiles?.handle}`} className="w-10 h-10 rounded-full bg-zinc-200 overflow-hidden shrink-0">
                          {post.profiles?.avatar_url && <img src={post.profiles.avatar_url} alt="" className="w-full h-full object-cover" />}
                        </Link>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-zinc-900 truncate">{post.profiles?.display_name || "Anonymous"}</span>
                            <span className="text-zinc-500 text-sm truncate">@{post.profiles?.handle}</span>
                          </div>
                          <p className="text-zinc-800 mt-1 whitespace-pre-wrap word-break">
                            {post.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Sidebar space for desktop */}
      <div className="hidden lg:block w-80 shrink-0 border-l border-zinc-200/50 bg-zinc-50 min-h-screen">
        <TrendingSidebar />
      </div>
    </div>
  );
}
