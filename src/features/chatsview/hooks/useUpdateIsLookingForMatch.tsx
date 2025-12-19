import { supabase } from "@/lib/supabase/client";
import { type UserProfile } from "./useCurrentUserProfile";
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function updateIsLookingForMatch(isLooking: boolean) {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  console.log("isLooking: ", isLooking);
  console.log("user Id is: ", user?.id);

  if (authError) throw authError;
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("user_profiles")
    .update({ is_looking_for_match: isLooking })
    .eq("id", user.id)
    .select("id, is_looking_for_match");
  console.log("update result", { data, error });

  if (error) throw error;

  return isLooking;
}

export function useUpdateIsLookingForMatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (isLooking: boolean) => updateIsLookingForMatch(isLooking),
    onSuccess: (isLooking) => {
      // Keep the cached profile in sync
      queryClient.setQueryData<UserProfile | null>(
        ["current_user_profile"],
        (old) => (old ? { ...old, is_looking_for_match: isLooking } : old)
      );
    },
  });
}
