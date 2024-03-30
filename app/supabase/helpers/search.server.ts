import { featureExtraction } from "@huggingface/inference";
import { array, number, parse } from "valibot";
import type { SupabaseClient } from "~/supabase/client.server";
import { getBookImageUrl } from "./storage.server";

export type SearchBooksOptions = {
	matchThreshold: number;
	matchCount: number;
};

export async function searchBooks(
	supabase: SupabaseClient,
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
		const { short_description, image_file_name, ...rest } = book;
		return {
			...rest,
			shortDescription: short_description,
			image: getBookImageUrl(supabase, image_file_name),
		};
	});
}

export type BookSearchResults = Awaited<ReturnType<typeof searchBooks>>;

const EmbeddingSchema = array(number());

async function getEmbeddings(query: string) {
	const embedding = await featureExtraction({
		model: "booksouls/fasttext-skipgram",
		inputs: query,
		accessToken: process.env.HF_API_KEY,
	});
	return parse(EmbeddingSchema, embedding);
}
