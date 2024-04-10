import { json, type ActionFunctionArgs } from "@remix-run/node";
import { createServerClient } from "~/supabase/client.server";
import { searchBooks } from "~/supabase/helpers/search.server";

export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData();
	const query = formData.get("query");

	if (typeof query !== "string") {
		throw new Error("Invalid query");
	}

	try {
		const supabase = createServerClient(request);
		const results = await searchBooks(supabase, query, {
			matchThreshold: 0.5,
			matchCount: 10,
		});
		return {
			results,
			query,
			error: false,
		};
	} catch (error) {
		console.error(error);
		return json(
			{
				results: null,
				query,
				error: true,
			},
			{ status: 500 },
		);
	}
}
