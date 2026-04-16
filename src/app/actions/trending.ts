"use server";

import { createClient } from "@/utils/supabase/server";

export async function getTrendingHashtags() {
  const supabase = await createClient();

  // 1. Fetch the last 100 posts
  const { data: posts } = await supabase
    .from("posts")
    .select("content")
    .order("created_at", { ascending: false })
    .limit(100);

  if (!posts || posts.length === 0) return [];

  const postTexts = posts.map((p) => p.content).join("\n---\n");

  // 2. Call Gemini API
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    console.warn("GEMINI_API_KEY is not set.");
    return [];
  }

  const prompt = `Here are the latest microblog posts separated by dashes:\n${postTexts}\n\nExtract and count the trending hashtags. Return exactly a JSON array of objects with keys 'hashtag' (string, prefixed with #) and 'count' (number) for the top 5 most frequent hashtags. Output ONLY valid JSON, do not include markdown \`\`\`json wrappers.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
        next: { revalidate: 300 } // Cache for 5 minutes across requests
      }
    );

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (text) {
      // Clean up markdown in case the prompt instructions failed
      const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleanedText);
      return Array.isArray(parsed) ? parsed : [];
    }
    
    return [];
  } catch (error) {
    console.error("AI Trending Error:", error);
    return [];
  }
}
