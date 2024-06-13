import type { LoaderFunctionArgs } from "@remix-run/node";
import { createServerClient, type SupabaseClient } from "~/supabase/client.server";
import { genres } from "~/utils/genres";

export async function loader({ params, request }: LoaderFunctionArgs) {
	const genre = String(params.genre);
	if (!genres.includes(genre)) {
		throw new Response("Genre not found", { status: 404 });
	}

	const supabase = createServerClient(request.headers);
	const books = await getBooksByGenre(supabase, genre);
	return { books };
}

async function getBooksByGenre(supabase: SupabaseClient, genre: string) {
	const { data, error } = await supabase
		.from("books")
		.select(
			"id, image, imageScaled:image_scaled, author, title, genres, shortDescription:short_description",
		)
		.contains("genres", [genre])
		.order("title");

	if (error !== null) {
		throw error;
	}

	return data;
}

export type Book = Awaited<ReturnType<typeof getBooksByGenre>>[number];
