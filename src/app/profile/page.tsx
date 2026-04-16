"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";

export default function ProfileSettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [handle, setHandle] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const supabase = createClient();

  useEffect(() => {
    async function loadProfile() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        window.location.href = "/login";
        return;
      }
      setUser(session.user);

      const { data, error } = await supabase
        .from("profiles")
        .select("handle, display_name, bio")
        .eq("id", session.user.id)
        .single();
        
      if (!error && data) {
        setHandle(data.handle || "");
        setDisplayName(data.display_name || "");
        setBio(data.bio || "");
      }
      setLoading(false);
    }
    loadProfile();
  }, [supabase]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setMessage(null);

    const { error } = await supabase
      .from("profiles")
      .update({
        handle: handle ? handle.toLowerCase() : null,
        display_name: displayName,
        bio: bio,
      })
      .eq("id", user.id);

    if (error) {
      setMessage({ text: error.message, type: "error" });
    } else {
      setMessage({ text: "Profile updated successfully", type: "success" });
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <div className="text-sm text-zinc-500">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center py-12 px-4 sm:px-6 lg:px-8 bg-zinc-50">
      <div className="w-full max-w-2xl space-y-8 bg-white p-8 sm:p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-100">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
            Profile Settings
          </h2>
          <p className="mt-2 text-sm text-zinc-500">
            Manage your minimal microblog presence.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6 mt-8">
          <div className="space-y-4">
             <div>
              <label htmlFor="handle" className="block text-sm font-medium text-zinc-700">
                Handle
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <span className="inline-flex items-center rounded-l-md border border-r-0 border-zinc-300 px-3 text-zinc-500 sm:text-sm bg-zinc-50 border-r border-zinc-200">
                  @
                </span>
                <input
                  type="text"
                  name="handle"
                  id="handle"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-zinc-300 py-2.5 px-3 text-zinc-900 placeholder-zinc-400 focus:z-10 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 sm:text-sm border transition-colors bg-zinc-50/50"
                  placeholder="echomaster"
                  pattern="[a-zA-Z0-9_]{3,15}"
                  title="3 to 15 characters, letters, numbers, and underscores only"
                />
              </div>
            </div>

            <div>
              <label htmlFor="display_name" className="block text-sm font-medium text-zinc-700">
                Display Name
              </label>
              <input
                type="text"
                name="display_name"
                id="display_name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="mt-1 relative block w-full rounded-lg border-zinc-300 py-2.5 px-3 text-zinc-900 placeholder-zinc-400 focus:z-10 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 sm:text-sm border transition-colors bg-zinc-50/50"
                placeholder="Echo Master"
              />
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-zinc-700">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="mt-1 relative block w-full rounded-lg border-zinc-300 py-2.5 px-3 text-zinc-900 placeholder-zinc-400 focus:z-10 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 sm:text-sm border transition-colors bg-zinc-50/50 resize-none"
                placeholder="A few words about you..."
                maxLength={160}
              />
              <p className="mt-2 text-xs text-zinc-500 text-right">
                {bio.length} / 160
              </p>
            </div>
          </div>

          {message && (
            <div className={`p-3 rounded-md text-sm text-center border ${
              message.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-600 border-red-100'
            }`}>
              {message.text}
            </div>
          )}

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex justify-center rounded-lg bg-zinc-900 py-2.5 px-6 text-sm font-medium text-white shadow-sm hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 transition-all disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
