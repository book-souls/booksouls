import { featureExtraction } from "@huggingface/inference";
import { array, number, parse } from "valibot";
import type { SupabaseServerClient } from "~/supabase/client.server";
import { getBookImageUrl } from "./storage.server";

export type SearchBooksOptions = {
	matchThreshold: number;
	matchCount: number;
};

export async function searchBooks(
	supabase: SupabaseServerClient,
	query: string,
	options: SearchBooksOptions,
) {
	const embeddings = await getEmbeddings(query);
	const { data, error } = await supabase.rpc("search_books", {
		query_embeddings: JSON.stringify(embeddings),
		match_threshold: options.matchThreshold,
		match_count: options.matchCount,
	});

	if (error !== null) {
		throw error;
	}

	return data.map((book) => {
		const { image_file_name, short_description, ...rest } = book;
		return {
			...rest,
			shortDescription: short_description,
			image: getBookImageUrl(supabase, image_file_name),
		};
	});
}

export type BookSearchResults = Awaited<ReturnType<typeof searchBooks>>;

const embeddingSchema = array(number());

async function getEmbeddings(query: string) {
	const embedding = await featureExtraction({
		model: "booksouls/fasttext-skipgram",
		inputs: query,
		accessToken: process.env.HF_API_KEY,
	});

	return parse(embeddingSchema, embedding);
}
