import { supabase } from "@/lib/supabase/client";

export type UserChat = { room_id: string; match_score: number | null };

export async function getUserChats(userId: string): Promise<UserChat[]> {
  const { data, error } = await supabase
    .from("room_members")
    .select("room_id, rooms!room_members_room_id_fkey ( match_score )")
    .eq("user_id", userId);
  console.log("data: ", data);

  if (error) throw error;
  if (data !== null) {
    return data.map((value) => {
      const matchScore = value.rooms?.match_score ?? null;
      if (matchScore) {
        console.log("match_score: ", matchScore);
      }
      return {
        room_id: value.room_id as string,
        match_score: matchScore,
      };
    });
  }
  return [];
}
