"use server";

import { createClient } from "@/utils/supabase/server";

export type PostWithEngagement = {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  likesCount: number;
  repostsCount: number;
  repliesCount: number;
  imageUrls: string[];
  hasLiked: boolean;
  hasReposted: boolean;
};

const ITEMS_PER_PAGE = 10;

export async function fetchPosts(page: number = 0): Promise<PostWithEngagement[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const from = page * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  // First fetch the users the current user follows
  let followedIds: string[] = [];
  if (user) {
    const { data: follows } = await supabase
      .from("follows")
      .select("following_id")
      .eq("follower_id", user.id);
      
    if (follows) {
      followedIds = follows.map((f: any) => f.following_id);
    }
    // Also include their own posts in the feed
    followedIds.push(user.id);
  }

  // To secure "ONLY show posts from users the current user follows"
  // For unauthorized users or empty followings, we might return empty or global. Let's return only their feed.
  if (followedIds.length === 0) {
    return [];
  }

  const { data: posts, error } = await supabase
    .from("posts")
    .select(
      `
      id,
      content,
      created_at,
      user_id,
      likes ( user_id ),
      reposts ( user_id ),
      replies ( id ),
      post_images ( image_url )
    `
    )
    .in('user_id', followedIds)
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
    const repliesList = post.replies || [];
    const imagesList = post.post_images || [];
    
    return {
      id: post.id,
      content: post.content,
      created_at: post.created_at,
      user_id: post.user_id,
      likesCount: likesList.length,
      repostsCount: repostsList.length,
      repliesCount: repliesList.length,
      imageUrls: imagesList.map((img: any) => img.image_url),
      hasLiked: user ? likesList.some((l: any) => l.user_id === user.id) : false,
      hasReposted: user ? repostsList.some((r: any) => r.user_id === user.id) : false,
      isOwnPost: user ? post.user_id === user.id : false,
    };
  });
}
