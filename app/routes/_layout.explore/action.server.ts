import type { ActionFunctionArgs } from "@vercel/remix";
import { createServerClient, type SupabaseClient } from "~/supabase/client.server";
import { searchBooks } from "~/supabase/helpers/search.server";
import { getBookImageUrl } from "~/supabase/helpers/storage";

export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData();
	const query = String(formData.get("query"));

	const supabase = createServerClient(request);
	const { data, error } = await getBookSearchResults(supabase, query);

	return {
		query,
		results: data,
		error: error?.message,
	};
}

async function getBookSearchResults(supabase: SupabaseClient, query: string) {
	const { data, error } = await searchBooks(supabase, {
		query,
		threshold: 0.5,
		limit: 10,
		select: "id, genres, title, shortDescription:short_description, image:image_file_name",
	});

	if (error !== null) {
		return { data: null, error };
	}

	for (const book of data) {
		book.image = getBookImageUrl(supabase, book.image);
	}

	return { data, error: null };
}

export type BookSearchResults = Awaited<ReturnType<typeof getBookSearchResults>>["data"];
