import type { SupabaseClient } from "../client.server";

export function getBookImageUrl(supabase: SupabaseClient, imageFileName: string) {
	const { data } = supabase.storage.from("books").getPublicUrl(imageFileName);
	return data.publicUrl;
}
