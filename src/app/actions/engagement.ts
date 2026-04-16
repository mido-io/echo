"use server";

import { createClient } from "@/utils/supabase/server";

export async function toggleLike(postId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Must be logged in to like a post");
  }

  // Check if like exists
  const { data: existingLike } = await supabase
    .from("likes")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .single();

  if (existingLike) {
    // Remove like
    await supabase.from("likes").delete().eq("id", existingLike.id);
    return { action: "unliked" };
  } else {
    // Add like
    await supabase.from("likes").insert({ post_id: postId, user_id: user.id });
    return { action: "liked" };
  }
}

export async function toggleRepost(postId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Must be logged in to repost");
  }

  // Check if repost exists
  const { data: existingRepost } = await supabase
    .from("reposts")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .single();

  if (existingRepost) {
    // Remove repost
    await supabase.from("reposts").delete().eq("id", existingRepost.id);
    return { action: "unreposted" };
  } else {
    // Add repost
    await supabase.from("reposts").insert({ post_id: postId, user_id: user.id });
    return { action: "reposted" };
  }
}
