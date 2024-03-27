import { createBrowserClient as _createBrowserClient } from "@supabase/ssr";
import { supabaseKey, supabaseUrl } from "./env";
import type { Database } from "./types";

export function createBrowserClient() {
	return _createBrowserClient<Database>(supabaseUrl, supabaseKey);
}
