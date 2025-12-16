import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";

export type UserProfile = {
  id: string;
  display_name: string | null;
  vibe_text: string | null;
  created_at: string;
  is_looking_for_match: boolean;
};

async function fetchCurrentUserProfile(): Promise<UserProfile | null> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw authError;

  // Not logged in
  if (!user) return null;

  const { data, error } = await supabase
    .from("user_profiles")
    .select("id, display_name, vibe_text, created_at, is_looking_for_match")
    .eq("id", user.id)
    .single();

  if (error) throw error;

  return data;
}

export function useCurrentUserProfile() {
  return useQuery({
    queryKey: ["current_user_profile"],
    queryFn: fetchCurrentUserProfile,
  });
}
