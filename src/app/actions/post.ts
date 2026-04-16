"use server";

import { createClient } from "@/utils/supabase/server";

export async function createPost(content: string, imageUrls: string[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Must be logged in to post");
  if (content.length > 280) throw new Error("Post is too long");
  if (imageUrls.length > 4) throw new Error("Maximum 4 images allowed");

  // Insert post
  const { data: post, error: postError } = await supabase
    .from("posts")
    .insert({ content, user_id: user.id })
    .select("id")
    .single();

  if (postError || !post) {
    throw new Error(postError?.message || "Failed to create post");
  }

  // Insert images if any
  if (imageUrls.length > 0) {
    const imagesToInsert = imageUrls.map(url => ({
      post_id: post.id,
      image_url: url
    }));
    
    await supabase.from("post_images").insert(imagesToInsert);
  }

  return post;
}

export async function deletePost(postId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Must be logged in to delete");

  // Row Level Security should be the primary enforcer, but application-level check is robust
  const { error } = await supabase
    .from("posts")
    .delete()
    .eq("id", postId)
    .eq("user_id", user.id); // Only their own

  if (error) {
    throw new Error(error.message);
  }
  
  return { success: true };
}

export async function createReply(postId: string, content: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Must be logged in to reply");
  if (content.length > 280) throw new Error("Reply is too long");
  if (content.trim().length === 0) throw new Error("Reply cannot be empty");

  const { data: reply, error } = await supabase
    .from("replies")
    .insert({ content, post_id: postId, user_id: user.id })
    .select("id")
    .single();

  if (error || !reply) {
    throw new Error(error?.message || "Failed to create reply");
  }

  return reply;
}
