"use client";

import { useState } from "react";
import { createPost } from "@/app/actions/post";
import { createClient } from "@/utils/supabase/client";

export function Composer({ onPostCreated }: { onPostCreated?: () => void }) {
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const charsLeft = 280 - content.length;
  const isInvalid = charsLeft < 0 || content.trim().length === 0;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files);
      if (files.length + selected.length > 4) {
        setError("Maximum 4 images allowed");
        return;
      }
      setError(null);
      setFiles((prev) => [...prev, ...selected].slice(0, 4));
    }
  };

  const uploadImages = async (): Promise<string[]> => {
    if (files.length === 0) return [];
    
    const supabase = createClient();
    const urls: string[] = [];

    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `post_images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('post_images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('post_images')
        .getPublicUrl(filePath);

      urls.push(data.publicUrl);
    }
    return urls;
  };

  const handleSubmit = async () => {
    if (isInvalid || isSubmitting) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const imageUrls = await uploadImages();
      await createPost(content, imageUrls);
      setContent("");
      setFiles([]);
      if (onPostCreated) onPostCreated();
    } catch (err: any) {
      setError(err.message || "Failed to post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-xl p-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black">
      <textarea
        placeholder="What's happening?"
        className="w-full bg-transparent resize-none outline-none text-[15px] font-normal leading-normal text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500"
        rows={3}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      {files.length > 0 && (
        <div className="flex gap-2 my-3 overflow-x-auto pb-2">
          {files.map((file, i) => (
            <div key={i} className="relative flex-shrink-0 w-24 h-24 rounded-md overflow-hidden bg-zinc-100 dark:bg-zinc-800">
              <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
              <button 
                className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 leading-none text-xs"
                onClick={() => setFiles(files.filter((_, index) => index !== i))}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}

      <div className="flex justify-between items-center mt-2 border-t border-zinc-100 dark:border-zinc-900 pt-2">
        <label className="cursor-pointer text-blue-500 hover:text-blue-600 p-2 -ml-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors">
          <input 
            type="file" 
            accept="image/png, image/jpeg, image/gif, image/webp" 
            multiple 
            className="hidden" 
            onChange={handleFileChange}
            disabled={files.length >= 4}
          />
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
            <circle cx="9" cy="9" r="2"/>
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
          </svg>
        </label>
        
        <div className="flex items-center gap-4">
          <span className={`text-sm ${charsLeft < 0 ? 'text-red-500' : 'text-zinc-400'}`}>
            {charsLeft}
          </span>
          <button
            onClick={handleSubmit}
            disabled={isInvalid || isSubmitting}
            className="bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 font-bold py-1.5 px-4 rounded-full text-sm transition-colors"
          >
            {isSubmitting ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
}
