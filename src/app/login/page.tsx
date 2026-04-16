"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const supabase = createClient();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });
    if (error) {
      setError(error.message);
    } else {
      setMessage("Check email to continue sign in process");
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
    } else {
      // Redirect to home or dashboard
      window.location.href = "/";
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 sm:p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-100">
        <div>
          <h2 className="mt-2 text-center text-3xl font-semibold tracking-tight text-zinc-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-zinc-500">
            Welcome to Echo - the minimal microblogging platform
          </p>
        </div>
        
        <form className="mt-8 space-y-6">
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-zinc-700">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 relative block w-full rounded-lg border-zinc-300 py-2.5 px-3 text-zinc-900 placeholder-zinc-400 focus:z-10 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 sm:text-sm border transition-colors bg-zinc-50/50"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="mt-1 relative block w-full rounded-lg border-zinc-300 py-2.5 px-3 text-zinc-900 placeholder-zinc-400 focus:z-10 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 sm:text-sm border transition-colors bg-zinc-50/50"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-500 text-center bg-red-50 p-2 rounded-md border border-red-100">{error}</p>}
          {message && <p className="text-sm text-zinc-600 text-center bg-zinc-100 p-2 rounded-md border border-zinc-200">{message}</p>}

          <div className="flex flex-col gap-3">
            <button
              type="submit"
              onClick={handleSignIn}
              className="group relative flex w-full justify-center rounded-lg bg-zinc-900 py-2.5 px-4 text-sm font-medium text-white hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 transition-all shadow-sm"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={handleSignUp}
              className="group relative flex w-full justify-center rounded-lg bg-white py-2.5 px-4 text-sm font-medium text-zinc-900 hover:bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 transition-all shadow-sm"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
