"use client";

import { useState } from "react";
import { toggleLike, toggleRepost } from "@/app/actions/engagement";

type PostProps = {
  id: string;
  content: string;
  initialLikes: number;
  initialReposts: number;
  initialHasLiked: boolean;
  initialHasReposted: boolean;
};

export function Post({
  id,
  content,
  initialLikes,
  initialReposts,
  initialHasLiked,
  initialHasReposted,
}: PostProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [hasLiked, setHasLiked] = useState(initialHasLiked);
  const [isLiking, setIsLiking] = useState(false);

  const [reposts, setReposts] = useState(initialReposts);
  const [hasReposted, setHasReposted] = useState(initialHasReposted);
  const [isReposting, setIsReposting] = useState(false);

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    
    // Optimistic update
    setHasLiked(!hasLiked);
    setLikes((prev) => (hasLiked ? prev - 1 : prev + 1));

    try {
      await toggleLike(id);
    } catch (error) {
      // Revert on failure
      setHasLiked(hasLiked);
      setLikes(initialLikes);
      console.error(error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleRepost = async () => {
    if (isReposting) return;
    setIsReposting(true);
    
    // Optimistic update
    setHasReposted(!hasReposted);
    setReposts((prev) => (hasReposted ? prev - 1 : prev + 1));

    try {
      await toggleRepost(id);
    } catch (error) {
      // Revert on failure
      setHasReposted(hasReposted);
      setReposts(initialReposts);
      console.error(error);
    } finally {
      setIsReposting(false);
    }
  };

  return (
    <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 break-words w-full max-w-xl bg-white dark:bg-black transition hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
      <p className="text-[15px] font-normal leading-normal text-zinc-900 dark:text-zinc-100 mb-3">
        {content}
      </p>
      
      <div className="flex items-center gap-6 text-zinc-500 dark:text-zinc-400 select-none">
        {/* Like Button */}
        <button
          onClick={handleLike}
          disabled={isLiking}
          aria-label="Like"
          className="group flex items-center gap-1.5 focus:outline-none disabled:opacity-50"
        >
          <div className={`p-2 -m-2 rounded-full transition-colors group-hover:bg-pink-100 dark:group-hover:bg-pink-950/30 group-hover:text-pink-600 dark:group-hover:text-pink-500 ${hasLiked ? "text-pink-500" : ""}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill={hasLiked ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </div>
          <span className={`text-[13px] font-medium ${hasLiked ? "text-pink-500" : "group-hover:text-pink-600 dark:group-hover:text-pink-500"}`}>
            {likes}
          </span>
        </button>

        {/* Repost Button */}
        <button
          onClick={handleRepost}
          disabled={isReposting}
          aria-label="Repost"
          className="group flex items-center gap-1.5 focus:outline-none disabled:opacity-50"
        >
          <div className={`p-2 -m-2 rounded-full transition-colors group-hover:bg-green-100 dark:group-hover:bg-green-950/30 group-hover:text-green-600 dark:group-hover:text-green-500 ${hasReposted ? "text-green-500" : ""}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m17 2 4 4-4 4"></path>
              <path d="M3 11v-1a4 4 0 0 1 4-4h14"></path>
              <path d="m7 22-4-4 4-4"></path>
              <path d="M21 13v1a4 4 0 0 1-4 4H3"></path>
            </svg>
          </div>
          <span className={`text-[13px] font-medium ${hasReposted ? "text-green-500" : "group-hover:text-green-600 dark:group-hover:text-green-500"}`}>
            {reposts}
          </span>
        </button>
      </div>
    </div>
  );
}
