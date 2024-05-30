import { redirect } from "@vercel/remix";
import type { SupabaseClient } from "~/supabase/client.server";

export async function requireAuth(supabase: SupabaseClient, responseHeaders: Headers) {
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (user === null) {
		throw redirect("/sign-in", { headers: responseHeaders });
	}

	return user;
}
