import { createBrowserClient } from "@supabase/ssr";

export const createClient = (url?: string, key?: string) => {
  const supabaseUrl = url || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey = key || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "";
  return createBrowserClient(supabaseUrl, supabaseKey);
};
