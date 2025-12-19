import { supabase } from "@/lib/supabase/client";

export async function getUserChats(userId: string) {
  const { data, error } = await supabase
    .from("room_members")
    .select("room_id")
    .eq("user_id", userId);

  if (error) throw error;
  if (data !== null) {
    return data.map((value) => {
      return value.room_id;
    });
  }
  return data;
}
