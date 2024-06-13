import type { LoaderFunctionArgs } from "@vercel/remix";
import { createServerClient, type SupabaseClient } from "~/supabase/client.server";

export async function loader({ request }: LoaderFunctionArgs) {
	const supabase = createServerClient(request.headers);
	const featuredBooks = await getFeaturedBooks(supabase);
	return { featuredBooks };
}

async function getFeaturedBooks(supabase: SupabaseClient) {
	const { data, error } = await supabase
		.from("books")
		.select(
			"id, image, imageScaled:image_scaled, title, genres, author, shortDescription:short_description, featured:is_featured",
		)
		.eq("is_featured", true)
		.order("title");

	if (error !== null) {
		throw error;
	}

	return data;
}

export type FeaturedBook = Awaited<ReturnType<typeof getFeaturedBooks>>[number];
