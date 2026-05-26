import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Guard: only call createClient when both vars are present.
// During Vercel build-time static generation the env vars may be absent;
// returning a no-op stub prevents the build from crashing.
let supabase;

const cookieStorage = {
  getItem: (key) => {
    if (typeof window === "undefined") return null;
    const match = document.cookie.match(new RegExp('(^| )' + key + '=([^;]+)'));
    if (match) return decodeURIComponent(match[2]);
    return localStorage.getItem(key);
  },
  setItem: (key, value) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(key, value);
    // Write cookie for server-side middleware (604800s = 7 days)
    document.cookie = `${key}=${encodeURIComponent(value)}; path=/; max-age=604800; SameSite=Lax; Secure`;
  },
  removeItem: (key) => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(key);
    // Remove cookie
    document.cookie = `${key}=; path=/; max-age=0; SameSite=Lax; Secure`;
  }
};

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      storage: cookieStorage,
      detectSessionInUrl: true,
      flowType: 'pkce'
    }
  });
} else {
  console.warn("Supabase environment variables are missing – using no-op stub.");
  // Minimal stub so imports don't crash during SSG
  supabase = {
    from: () => ({
      select: () => ({ data: [], error: null }),
      insert: () => ({ data: null, error: null }),
      update: () => ({ data: null, error: null }),
      delete: () => ({ data: null, error: null }),
      eq: () => ({ data: [], error: null }),
      order: () => ({ data: [], error: null }),
    }),
    auth: { getSession: async () => ({ data: null, error: null }) },
  };
}

export { supabase };
