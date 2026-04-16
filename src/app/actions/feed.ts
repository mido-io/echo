"use server";

import { createClient } from "@/utils/supabase/server";

export type PostWithEngagement = {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  likesCount: number;
  repostsCount: number;
  hasLiked: boolean;
  hasReposted: boolean;
};

const ITEMS_PER_PAGE = 10;

export async function fetchPosts(page: number = 0): Promise<PostWithEngagement[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const from = page * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  // For an MVP, we fetch the `user_id` inside likes & reposts arrays to compute counts and toggles locally.
  // In production, this would be an RPC call or view computing counts directly for performance.
  const { data: posts, error } = await supabase
    .from("posts")
    .select(
      `
      id,
      content,
      created_at,
      user_id,
      likes ( user_id ),
      reposts ( user_id )
    `
    )
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error || !posts) {
    console.error("Error fetching posts:", error);
    return [];
  }

  // Map the relations into the flat Engagement structure expected by the UI.
  return posts.map((post: any) => {
    const likesList = post.likes || [];
    const repostsList = post.reposts || [];
    
    return {
      id: post.id,
      content: post.content,
      created_at: post.created_at,
      user_id: post.user_id,
      likesCount: likesList.length,
      repostsCount: repostsList.length,
      hasLiked: user ? likesList.some((l: any) => l.user_id === user.id) : false,
      hasReposted: user ? repostsList.some((r: any) => r.user_id === user.id) : false,
    };
  });
}
