import type { SupabaseClient } from "~/supabase/client.server";

export function getBooksBucketUrl(supabase: SupabaseClient, path: string) {
	const { data } = supabase.storage.from("books").getPublicUrl(path);
	return data.publicUrl;
}
