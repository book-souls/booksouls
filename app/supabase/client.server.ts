import { createServerClient as _createServerClient, parse, serialize } from "@supabase/ssr";
import { supabaseKey, supabaseUrl } from "./env";
import type { Database } from "./types";

export function createServerClient(requestHeaders: Headers, responseHeaders?: Headers) {
	const cookies = parse(requestHeaders.get("Cookie") ?? "");
	return _createServerClient<Database>(supabaseUrl, supabaseKey, {
		cookies: {
			get(key) {
				return cookies[key];
			},
			set(key, value, options) {
				responseHeaders?.append("Set-Cookie", serialize(key, value, options));
			},
			remove(key, options) {
				responseHeaders?.append("Set-Cookie", serialize(key, "", options));
			},
		},
		auth: {
			flowType: "pkce",
		},
	});
}

export type SupabaseClient = ReturnType<typeof createServerClient>;
