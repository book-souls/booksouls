import { createBrowserClient } from "@supabase/ssr";
import { supabaseKey, supabaseUrl } from "./env";
import type { Database } from "./types";

function createClient() {
	return createBrowserClient<Database>(supabaseUrl, supabaseKey);
}

export { createClient as createBrowserClient };
