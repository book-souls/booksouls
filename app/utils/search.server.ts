import { isNumber } from "./validate";

export async function generateSearchEmbedding(query: string) {
	const url = new URL("/vectorize", process.env.RECOMMENDATION_BASE_URL);
	const response = await fetch(url, {
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
