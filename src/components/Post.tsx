"use client";

import { useState } from "react";
import { toggleLike, toggleRepost } from "@/app/actions/engagement";
import { deletePost, createReply } from "@/app/actions/post";

type PostProps = {
  id: string;
  content: string;
  initialLikes: number;
  initialReposts: number;
  initialReplies: number;
  initialHasLiked: boolean;
  initialHasReposted: boolean;
  isOwnPost: boolean;
  imageUrls?: string[];
  onDelete?: (id: string) => void;
};

// Sub-component: PostHeader
function PostHeader({ isOwnPost, onDelete, id }: { isOwnPost: boolean, onDelete?: (id: string) => void, id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Delete this post?")) return;
    setIsDeleting(true);
    try {
      await deletePost(id);
      if (onDelete) onDelete(id);
    } catch (e) {
      console.error(e);
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex justify-between items-start mb-2">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 shrink-0"></div>
        <div>
          <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">User</p>
          <p className="text-sm text-zinc-500">@user</p>
        </div>
      </div>
      {isOwnPost && (
        <button 
          disabled={isDeleting}
          onClick={handleDelete}
          className="text-zinc-400 hover:text-red-500 p-2 -mr-2 rounded-full hover:bg-red-50 dark:hover:bg-red-950/30 transition"
          aria-label="Delete Post"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
          </svg>
        </button>
      )}
    </div>
  );
}

// Sub-component: PostBody
function PostBody({ content, imageUrls }: { content: string, imageUrls?: string[] }) {
  return (
    <div className="pl-12">
      <p className="text-[15px] font-normal leading-normal text-zinc-900 dark:text-zinc-100 mb-3 whitespace-pre-wrap">
        {content}
      </p>
      {imageUrls && imageUrls.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mb-3">
          {imageUrls.map((url, i) => (
            <img key={i} src={url} alt="Post attachment" className="rounded-2xl border border-zinc-100 dark:border-zinc-800 object-cover w-full h-full max-h-64" />
          ))}
        </div>
      )}
    </div>
  );
}

// Sub-component: PostActions
function PostActions({
  id,
  likes,
  reposts,
  replies,
  hasLiked,
  hasReposted,
  onToggleLike,
  onToggleRepost,
  onReplyClick,
}: {
  id: string;
  likes: number;
  reposts: number;
  replies: number;
  hasLiked: boolean;
  hasReposted: boolean;
  onToggleLike: () => void;
  onToggleRepost: () => void;
  onReplyClick: () => void;
}) {
  return (
    <div className="flex items-center gap-6 text-zinc-500 dark:text-zinc-400 select-none pl-12">
      {/* Replies Button */}
      <button onClick={onReplyClick} aria-label="Reply" className="group flex items-center gap-1.5 focus:outline-none">
        <div className="p-2 -m-2 rounded-full transition-colors group-hover:bg-blue-100 dark:group-hover:bg-blue-950/30 group-hover:text-blue-600 dark:group-hover:text-blue-500">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </div>
        <span className="text-[13px] font-medium group-hover:text-blue-600 dark:group-hover:text-blue-500">{replies}</span>
      </button>

      {/* Reposts Button */}
      <button onClick={onToggleRepost} aria-label="Repost" className="group flex items-center gap-1.5 focus:outline-none">
        <div className={`p-2 -m-2 rounded-full transition-colors group-hover:bg-green-100 dark:group-hover:bg-green-950/30 group-hover:text-green-600 dark:group-hover:text-green-500 ${hasReposted ? "text-green-500" : ""}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m17 2 4 4-4 4"></path>
            <path d="M3 11v-1a4 4 0 0 1 4-4h14"></path>
            <path d="m7 22-4-4 4-4"></path>
            <path d="M21 13v1a4 4 0 0 1-4 4H3"></path>
          </svg>
        </div>
        <span className={`text-[13px] font-medium ${hasReposted ? "text-green-500" : "group-hover:text-green-600 dark:group-hover:text-green-500"}`}>{reposts}</span>
      </button>

      {/* Likes Button */}
      <button onClick={onToggleLike} aria-label="Like" className="group flex items-center gap-1.5 focus:outline-none">
        <div className={`p-2 -m-2 rounded-full transition-colors group-hover:bg-pink-100 dark:group-hover:bg-pink-950/30 group-hover:text-pink-600 dark:group-hover:text-pink-500 ${hasLiked ? "text-pink-500" : ""}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill={hasLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </div>
        <span className={`text-[13px] font-medium ${hasLiked ? "text-pink-500" : "group-hover:text-pink-600 dark:group-hover:text-pink-500"}`}>{likes}</span>
      </button>
    </div>
  );
}

// Main Post Component
export function Post({
  id,
  content,
  initialLikes,
  initialReposts,
  initialReplies,
  initialHasLiked,
  initialHasReposted,
  isOwnPost,
  imageUrls = [],
  onDelete
}: PostProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [hasLiked, setHasLiked] = useState(initialHasLiked);
  const [reposts, setReposts] = useState(initialReposts);
  const [hasReposted, setHasReposted] = useState(initialHasReposted);
  
  const [repliesCount, setRepliesCount] = useState(initialReplies);
  const [showReplyComposer, setShowReplyComposer] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  const handleLike = async () => {
    setHasLiked(!hasLiked);
    setLikes(prev => hasLiked ? prev - 1 : prev + 1);
    try { await toggleLike(id); } catch {
      setHasLiked(hasLiked);
      setLikes(initialLikes);
    }
  };

  const handleRepost = async () => {
    setHasReposted(!hasReposted);
    setReposts(prev => hasReposted ? prev - 1 : prev + 1);
    try { await toggleRepost(id); } catch {
      setHasReposted(hasReposted);
      setReposts(initialReposts);
    }
  };

  const submitReply = async () => {
    if (!replyContent.trim() || isReplying) return;
    setIsReplying(true);
    try {
      await createReply(id, replyContent);
      setReplyContent("");
      setShowReplyComposer(false);
      setRepliesCount(prev => prev + 1);
    } catch (e) {
      console.error(e);
    } finally {
      setIsReplying(false);
    }
  };

  return (
    <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 break-words w-full max-w-xl bg-white dark:bg-black transition min-w-[320px]">
      <PostHeader isOwnPost={isOwnPost} onDelete={onDelete} id={id} />
      <PostBody content={content} imageUrls={imageUrls} />
      <div className="mt-3">
        <PostActions 
          id={id} 
          likes={likes} 
          reposts={reposts} 
          replies={repliesCount} 
          hasLiked={hasLiked} 
          hasReposted={hasReposted} 
          onToggleLike={handleLike} 
          onToggleRepost={handleRepost} 
          onReplyClick={() => setShowReplyComposer(!showReplyComposer)}
        />
      </div>

      {showReplyComposer && (
        <div className="mt-4 pl-12 animate-in fade-in slide-in-from-top-2 duration-200">
          <textarea
            placeholder="Post your reply"
            className="w-full bg-transparent resize-none outline-none text-[15px] pb-2 border-b border-zinc-200 dark:border-zinc-800"
            rows={2}
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            disabled={isReplying}
          />
          <div className="flex justify-between items-center mt-2">
            <span className={`text-xs ${280 - replyContent.length < 0 ? 'text-red-500' : 'text-zinc-500'}`}>
              {280 - replyContent.length}
            </span>
            <button
              onClick={submitReply}
              disabled={!replyContent.trim() || replyContent.length > 280 || isReplying}
              className="bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 font-bold py-1 px-4 rounded-full text-sm"
            >
              Reply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
