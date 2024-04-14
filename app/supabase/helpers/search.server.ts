import { featureExtraction, InferenceOutputError } from "@huggingface/inference";
import type { SupabaseClient } from "../client.server";

export type SearchBooksProps<TSelect extends string> = {
	query: string;
	threshold: number;
	limit: number;
	select: TSelect;
};

export async function searchBooks<TSelect extends string>(
	supabase: SupabaseClient,
	{ query, threshold, limit, select }: SearchBooksProps<TSelect>,
) {
	try {
		const embeddings = await featureExtraction({
			model: "booksouls/fasttext-skipgram",
			inputs: query.replaceAll("\n", ". ").trim(),
			accessToken: process.env.HF_API_KEY,
		});

		return await supabase
			.rpc("search_books", {
				query_embeddings: JSON.stringify(embeddings),
				match_threshold: threshold,
				match_limit: limit,
			})
			.select(select);
	} catch (error) {
		if (error instanceof InferenceOutputError) {
			return { data: null, error };
		}

		throw error;
	}
}
