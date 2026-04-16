"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

export function FollowButton({ targetUserId, initialFollowing }: { targetUserId: string, initialFollowing: boolean }) {
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  async function handleToggleFollow() {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) return;
    
    try {
      if (isFollowing) {
        // Unfollow
        await supabase
          .from("follows")
          .delete()
          .eq("follower_id", session.user.id)
          .eq("following_id", targetUserId);
        setIsFollowing(false);
      } else {
        // Follow
        await supabase
          .from("follows")
          .insert({ follower_id: session.user.id, following_id: targetUserId });
        setIsFollowing(true);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  }

  return (
    <button
      onClick={handleToggleFollow}
      disabled={loading}
      className={`px-5 py-2 text-sm font-medium rounded-full shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 disabled:opacity-50 ${
        isFollowing 
          ? "bg-white text-zinc-800 border border-zinc-200 hover:border-red-200 hover:text-red-500 hover:bg-red-50 focus:ring-red-500" 
          : "bg-zinc-900 text-white border border-transparent hover:bg-zinc-800"
      }`}
    >
      {loading ? "..." : isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
}
