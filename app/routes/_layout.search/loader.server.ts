import { json, type LoaderFunctionArgs } from "@vercel/remix";
import { createServerClient, type SupabaseClient } from "~/supabase/client.server";
import { isNumber } from "~/utils/validate";

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
		return json({ results: null, error: true }, { status: 500 });
	}
}

async function getBookSearchResults(supabase: SupabaseClient, query: string) {
	const embedding = await generateSearchEmbedding(query);
	const { data: results, error } = await supabase
		.rpc("hybrid_book_search", {
			query,
			query_embedding: JSON.stringify(embedding),
			match_limit: 10,
		})
		.select(
			"id, title, genres, author, shortDescription:short_description, image, imageScaled:image_scaled",
		);

	if (error !== null) {
		throw error;
	}

	return results;
}

export async function generateSearchEmbedding(query: string) {
	const response = await fetch("https://api.booksouls.site/vectorize", {
		method: "POST",
		body: JSON.stringify({
			input: preprocessSearchQuery(query),
		}),
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		throw new Error(`Failed to generate search embedding: ${response.statusText}`);
	}

	const embedding: unknown = await response.json();
	if (!Array.isArray(embedding) || embedding.length !== 300 || !embedding.every(isNumber)) {
		throw new Error(`Unexpected embedding response: ${JSON.stringify(embedding)}`);
	}

	return embedding;
}

function preprocessSearchQuery(query: string) {
	// FastText cannot handle newlines.
	return query.replaceAll("\n", ". ").trim();
}

export type Book = Awaited<ReturnType<typeof getBookSearchResults>>[number];
