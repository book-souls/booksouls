import {
	createBrowserClient as _createBrowserClient,
	createServerClient as _createServerClient,
	parse,
	serialize,
} from "@supabase/ssr";
import type { Database } from "./types";

const supabaseUrl = "https://pbmtepadbgllxljfxprp.supabase.co";
const supabaseKey =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBibXRlcGFkYmdsbHhsamZ4cHJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk1OTg1NjEsImV4cCI6MjAyNTE3NDU2MX0.Yu5rPRIZUfI37uSKcXhzakSYonIdbJX2upUQhXop_Eo";

export function createServerClient(request: Request, responseHeaders: Headers) {
	const cookies = parse(request.headers.get("Cookie") ?? "");
	return _createServerClient<Database>(supabaseUrl, supabaseKey, {
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

export function createBrowserClient() {
	return _createBrowserClient<Database>(supabaseUrl, supabaseKey);
}
