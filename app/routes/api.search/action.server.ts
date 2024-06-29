import { featureExtraction } from "@huggingface/inference";
import { json, type ActionFunctionArgs } from "@vercel/remix";
import { createServerClient, type SupabaseClient } from "~/supabase/client.server";
import { HF_TOKEN } from "~/utils/env.server";
import { isNumber, isString } from "~/utils/validate";
import { preprocessQuery } from "./preprocess";

export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData();
	const query = formData.get("query");

	if (!isString(query)) {
		throw new Response("Invalid query", { status: 400 });
	}

	try {
		const supabase = createServerClient(request.headers);
		const results = await getSearchResults(supabase, query);
		return json({
			results,
			error: false,
		});
	} catch (error) {
		console.error("Failed to search:", error);
		return json(
			{
				results: null,
				error: true,
			},
			{ status: 500 },
		);
	}
}

async function getSearchResults(supabase: SupabaseClient, query: string) {
	const embedding = await featureExtraction({
		inputs: preprocessQuery(query),
		model: "booksouls/fasttext-goodreads-vectors",
		accessToken: HF_TOKEN,
	});

	if (embedding.length !== 300 || !embedding.every(isNumber)) {
		throw new Error(`Unexpected embedding response: ${JSON.stringify(embedding)}`);
	}

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

export type SearchResult = Awaited<ReturnType<typeof getSearchResults>>[number];
