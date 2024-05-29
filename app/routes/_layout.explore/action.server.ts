import type { ActionFunctionArgs } from "@vercel/remix";
import { createServerClient, type SupabaseClient } from "~/supabase/client.server";
import { generateSearchEmbedding, preprocessSearchQuery } from "~/supabase/helpers/search.server";
import { getBooksBucketUrl } from "~/supabase/helpers/storage";

export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData();
	const query = String(formData.get("query"));

	const supabase = createServerClient(request);
	const { data, error } = await getBookSearchResults(supabase, query);

	return {
		query,
		results: data,
		error: error?.message,
	};
}

async function getBookSearchResults(supabase: SupabaseClient, query: string) {
	const preprocessedQuery = preprocessSearchQuery(query);
	const { data: embedding, error: embeddingError } =
		await generateSearchEmbedding(preprocessedQuery);

	if (embeddingError !== null) {
		return { data: null, error: embeddingError };
	}

	const { data: results, error: resultsError } = await supabase
		.rpc("hybrid_book_search", {
			query: preprocessedQuery,
			query_embedding: JSON.stringify(embedding),
			match_limit: 10,
		})
		.select("id, title, genres, author, shortDescription:short_description, image:image_file_name");

	if (resultsError !== null) {
		return { data: null, error: resultsError };
	}

	for (const book of results) {
		book.image = getBooksBucketUrl(supabase, book.image);
	}

	return { data: results, error: null };
}

export type BookSearchResults = Awaited<ReturnType<typeof getBookSearchResults>>["data"];
