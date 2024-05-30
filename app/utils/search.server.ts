import { featureExtraction } from "@huggingface/inference";

export function generateSearchEmbedding(query: string) {
	return featureExtraction({
		model: "booksouls/fasttext-skipgram",
		inputs: preprocessSearchQuery(query),
		accessToken: process.env.HF_API_KEY,
	});
}

function preprocessSearchQuery(query: string) {
	// FastText cannot handle newlines.
	return query.replaceAll("\n", ". ").trim();
}
