import { createBrowserClient } from "@supabase/ssr";

export const createClient = (url?: string, key?: string) => {
  const supabaseUrl = url || process.env.NEXT_PUBLI_SUPABASE_URL || "";
  const supabaseKey = key || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "";

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("❌ ไม่พบการตั้งค่า NEXT_PUBLIC_SUPABASE_URL หรือ NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (อาจถูก Comment ใน .env.local)");
  }

  return createBrowserClient(supabaseUrl, supabaseKey);
};
