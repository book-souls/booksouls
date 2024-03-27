import type { SupabaseServerClient } from "../client.server";

export function getBookImageUrl(supabase: SupabaseServerClient, imageFileName: string) {
	const { data } = supabase.storage.from("books").getPublicUrl(imageFileName);
	return data.publicUrl;
}
