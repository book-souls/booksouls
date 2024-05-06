import { featureExtraction, InferenceOutputError } from "@huggingface/inference";

export async function generateSearchEmbedding(query: string) {
	try {
		const data = await featureExtraction({
			model: "booksouls/fasttext-skipgram",
			inputs: query,
			accessToken: process.env.HF_API_KEY,
		});

		return { data, error: null };
	} catch (error) {
		if (error instanceof InferenceOutputError) {
			return { data: null, error };
		}

		throw error;
	}
}

export function preprocessSearchQuery(query: string) {
	return query.replaceAll("\n", ". ").trim();
}
