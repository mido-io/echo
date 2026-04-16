"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { fetchPosts, PostWithEngagement } from "@/app/actions/feed";
import { Post } from "./Post";

export function Feed() {
  const [posts, setPosts] = useState<PostWithEngagement[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const bottomBoundaryRef = useRef<HTMLDivElement | null>(null);

  const loadMorePosts = useCallback(async () => {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    try {
      const newPosts = await fetchPosts(page);
      if (newPosts.length === 0) {
        setHasMore(false);
      } else {
        // Simple deduplication strategy for MVP
        setPosts((prev: PostWithEngagement[]) => {
          const existingIds = new Set(prev.map((p) => p.id));
          return [...prev, ...newPosts.filter((p) => !existingIds.has(p.id))];
        });
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Failed to load posts:", error);
    } finally {
      setIsLoading(false);
    }
  }, [page, isLoading, hasMore]);

  // Set up the Intersection Observer
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver((entries) => {
      const first = entries[0];
      if (first.isIntersecting) {
        loadMorePosts();
      }
    }, {
      threshold: 0.1, // Trigger just as it comes into view
      rootMargin: "100px", // Pre-fetch slightly before hitting bottom
    });

    if (bottomBoundaryRef.current) {
      observerRef.current.observe(bottomBoundaryRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMorePosts]);

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto border-x border-zinc-200 dark:border-zinc-800 min-h-screen">
      {posts.length === 0 && !isLoading && (
        <div className="p-8 text-center text-zinc-500">
          No posts yet. Be the first to post!
        </div>
      )}
      
      {posts.map((post) => (
        <Post
          key={post.id}
          id={post.id}
          content={post.content}
          initialLikes={post.likesCount}
          initialReposts={post.repostsCount}
          initialHasLiked={post.hasLiked}
          initialHasReposted={post.hasReposted}
        />
      ))}

      {/* Intersection Observer Target */}
      <div 
        ref={bottomBoundaryRef} 
        className="w-full py-8 flex justify-center items-center"
      >
        {isLoading && (
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-zinc-900 dark:border-white"></div>
        )}
        {!isLoading && !hasMore && posts.length > 0 && (
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            You've reached the end!
          </span>
        )}
      </div>
    </div>
  );
}
