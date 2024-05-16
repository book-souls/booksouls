import { featureExtraction, InferenceOutputError } from "@huggingface/inference";
import { get } from "@vercel/edge-config";

export async function generateSearchEmbedding(query: string) {
	const model = await getModelName();
	try {
		const data = await featureExtraction({
			model,
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

async function getModelName() {
	const model = await get("recommendation_model_name");
	if (typeof model !== "string") {
		return "booksouls/fasttext-skipgram";
	}
	return model;
}

export function preprocessSearchQuery(query: string) {
	return query.replaceAll("\n", ". ").trim();
}
