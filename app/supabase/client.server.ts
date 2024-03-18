import { createServerClient, parse, serialize } from "@supabase/ssr";
import { supabaseKey, supabaseUrl } from "./env";
import type { Database } from "./types";

function createClient(request: Request, responseHeaders: Headers) {
	const cookies = parse(request.headers.get("Cookie") ?? "");
	return createServerClient<Database>(supabaseUrl, supabaseKey, {
		cookies: {
			get(key) {
				return cookies[key];
			},
			set(key, value, options) {
				responseHeaders.append("Set-Cookie", serialize(key, value, options));
			},
			remove(key, options) {
				responseHeaders.append("Set-Cookie", serialize(key, "", options));
			},
		},
	});
}

export { createClient as createServerClient };

export type ServerClient = ReturnType<typeof createClient>;
