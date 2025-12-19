// src/lib/supabase/client.ts
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "database.types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env
  .VITE_SUPABASE_PUBLISHABLE_OR_ANON_KEY as string;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase env vars");
}

// Singleton client: created once at module load
export const supabase = createSupabaseClient<Database>(
  supabaseUrl,
  supabaseKey
  // { db: { schema: 'public' } } // plus options if needed
);

// Named export to satisfy existing imports; returns the singleton.
export const createClient = () => supabase;
