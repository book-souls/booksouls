import { defer, type LoaderFunctionArgs } from "@vercel/remix";
import { createServerClient, type SupabaseClient } from "~/supabase/client.server";
import { searchBooks } from "~/supabase/helpers/search.server";
import { getBookImageUrl } from "~/supabase/helpers/storage";

export async function loader({ params, request }: LoaderFunctionArgs) {
	const id = Number(params.id);
	const supabase = createServerClient(request);
	const book = await getBook(supabase, id);
	const similarBooks = getSimilarBooks(supabase, book);
	return defer({ book, similarBooks });
}

async function getBook(supabase: SupabaseClient, id: number) {
	const { data, error } = await supabase
		.from("books")
		.select(
			"id, title, genres, shortDescription:short_description, description, image:image_file_name",
		)
		.eq("id", id)
		.maybeSingle();

	if (error !== null) {
		throw error;
	}

	if (data === null) {
		throw new Response("Book not found", {
			status: 404,
		});
	}

	data.image = getBookImageUrl(supabase, data.image);
	return data;
}

async function getSimilarBooks(
	supabase: SupabaseClient,
	book: { id: number; description: string },
) {
	const { data, error } = await searchBooks(supabase, {
		query: book.description,
		threshold: 0.5,
		limit: 9,
		select: "id, title, image:image_file_name",
	});

	if (error !== null) {
		throw error;
	}

	for (const book of data) {
		book.image = getBookImageUrl(supabase, book.image);
	}

	return data.filter(({ id }) => book.id !== id);
}

export type SimilarBooksResult = Awaited<ReturnType<typeof getSimilarBooks>>;
