import { redirect } from "@vercel/remix";
import type { SupabaseClient } from "../client.server";

export async function requireAuth(supabase: SupabaseClient, headers: Headers) {
	const { data, error } = await supabase.auth.getUser();
	if (error !== null) {
		throw redirect("/sign-in", { headers });
	}
	return data.user;
}
