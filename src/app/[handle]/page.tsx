import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { FollowButton } from "./FollowButton";

export default async function PublicProfile({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const decodedHandle = decodeURIComponent(handle);
  const supabase = await createClient();
  
  // Get active session
  const { data: { session } } = await supabase.auth.getSession();
  const currentUserId = session?.user?.id;

  // Fetch user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("handle", decodedHandle)
    .single();

  if (!profile) {
    notFound();
  }

  // Check if following
  let isFollowing = false;
  if (currentUserId) {
    const { data: followData } = await supabase
      .from("follows")
      .select("*")
      .eq("follower_id", currentUserId)
      .eq("following_id", profile.id)
      .single();
    
    if (followData) isFollowing = true;
  }

  return (
    <div className="flex min-h-screen flex-col items-center py-12 px-4 sm:px-6 lg:px-8 bg-zinc-50">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-100 overflow-hidden">
        {/* Header */}
        <div className="h-32 bg-zinc-200 w-full relative">
          {profile.header_url && (
            <img src={profile.header_url} alt="Header" className="w-full h-full object-cover" />
          )}
        </div>
        
        <div className="px-8 pb-8">
          <div className="flex justify-between items-end -mt-12 mb-4 relative z-10">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-white p-1 shadow-sm">
              <div className="w-full h-full rounded-full bg-zinc-100 overflow-hidden">
                {profile.avatar_url && (
                  <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                )}
              </div>
            </div>
            
            {/* Follow Button */}
            {currentUserId && currentUserId !== profile.id && (
              <FollowButton 
                targetUserId={profile.id} 
                initialFollowing={isFollowing} 
              />
            )}
          </div>
          
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">{profile.display_name || "Anonymous"}</h1>
            <p className="text-zinc-500">@{profile.handle}</p>
          </div>
          
          {profile.bio && (
            <p className="mt-4 text-zinc-800 whitespace-pre-wrap">{profile.bio}</p>
          )}
        </div>
      </div>
    </div>
  );
}
