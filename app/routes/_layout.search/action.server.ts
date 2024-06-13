import type { ActionFunctionArgs } from "@vercel/remix";
import { createServerClient, type SupabaseClient } from "~/supabase/client.server";
import { generateSearchEmbedding } from "~/utils/search.server";
import { isString } from "~/utils/validate";

export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData();
	const query = formData.get("query");
	if (!isString(query)) {
		throw new Error(`Invalid query: ${query}`);
	}

	try {
		const supabase = createServerClient(request.headers);
		const results = await getBookSearchResults(supabase, query);
		return {
			query,
			results,
			error: false,
		};
	} catch (error) {
		console.error("Failed to search:", error);
		return {
			query,
			results: null,
			error: true,
		};
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

export type BookSearchResults = Awaited<ReturnType<typeof getBookSearchResults>>;
