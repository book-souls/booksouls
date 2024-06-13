import type { LoaderFunctionArgs } from "@remix-run/server-runtime";
import { createServerClient, type SupabaseClient } from "~/supabase/client.server";
import { generateSearchEmbedding } from "~/utils/search.server";

export async function loader({ request }: LoaderFunctionArgs) {
	const url = new URL(request.url);
	const query = url.searchParams.get("query");
	if (!query) {
		return { results: null, error: null };
	}

	try {
		const supabase = createServerClient(request.headers);
		const results = await getBookSearchResults(supabase, query);
		return { results, error: null };
	} catch (error) {
		console.error("Failed to get search results:", error);
		return { results: null, error: true };
	}
}

async function getBookSearchResults(supabase: SupabaseClient, query: string) {
	const embedding = await generateSearchEmbedding(query);
	const { data: results, error } = await supabase
		.rpc("hybrid_book_search", {
			query,
			query_embedding: JSON.stringify(embedding),
			match_limit: 30,
		})
		.select(
			"id, title, genres, author, shortDescription:short_description, image, imageScaled:image_scaled",
		);

	if (error !== null) {
		throw error;
	}

	return results;
}

export type Book = Awaited<ReturnType<typeof getBookSearchResults>>[number];
