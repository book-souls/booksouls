import { defer, type LoaderFunctionArgs } from "@vercel/remix";
import { createServerClient, type SupabaseClient } from "~/supabase/client.server";
import { generateSearchEmbedding, preprocessSearchQuery } from "~/supabase/helpers/search.server";
import { getBookImageUrl } from "~/supabase/helpers/storage";

export async function loader({ params, request }: LoaderFunctionArgs) {
	const id = Number(params.id);
	const supabase = createServerClient(request);
	const book = await getBook(supabase, id);
	const similarBooks = getSimilarBooks(supabase, book);
	return defer({ book, similarBooks });
}

async function getBook(supabase: SupabaseClient, id: number) {
	const { data, error } = await supabase
		.from("books")
		.select(
			"id, title, genres, shortDescription:short_description, description, image:image_file_name",
		)
		.eq("id", id)
		.maybeSingle();

	if (error !== null) {
		throw error;
	}

	if (data === null) {
		throw new Response("Book not found", {
			status: 404,
		});
	}

	data.image = getBookImageUrl(supabase, data.image);
	return data;
}

async function getSimilarBooks(
	supabase: SupabaseClient,
	book: { id: number; description: string },
) {
	const query = preprocessSearchQuery(book.description);
	const { data: embedding, error: embeddingError } = await generateSearchEmbedding(query);

	if (embeddingError !== null) {
		// TODO: handle error
		throw embeddingError;
	}

	const { data: results, error: resultsError } = await supabase
		.rpc("book_search", {
			query_embedding: JSON.stringify(embedding),
			match_threshold: 0.5,
			match_limit: 9,
		})
		.select("id, title, image:image_file_name");

	if (resultsError !== null) {
		// TODO: handle error
		throw resultsError;
	}

	for (const book of results) {
		book.image = getBookImageUrl(supabase, book.image);
	}

	// Don't suggest the same book.
	return results.filter(({ id }) => book.id !== id);
}

export type SimilarBooksResult = Awaited<ReturnType<typeof getSimilarBooks>>;
