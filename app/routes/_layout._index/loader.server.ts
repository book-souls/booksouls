import type { LoaderFunctionArgs } from "@remix-run/node";
import { createServerClient, type SupabaseClient } from "~/supabase/client.server";

export async function loader({ request }: LoaderFunctionArgs) {
	const supabase = createServerClient(request);
	const books = await getBooks(supabase);
	return {
		books: groupBooksByGenre(books),
		featuredBooks: books.filter((book) => book.featured),
	};
}

async function getBooks(supabase: SupabaseClient) {
	const { data, error } = await supabase
		.from("books")
		.select("id, title, genres, shortDescription:short_description, featured:is_featured")
		.order("title");

	if (error !== null) {
		throw error;
	}

	return data;
}

export type Book = Awaited<ReturnType<typeof getBooks>>[number];

function groupBooksByGenre(books: Book[]) {
	const bookGenreMap: Record<string, Book[]> = {};
	for (const book of books) {
		for (const genre of book.genres) {
			bookGenreMap[genre] ??= [];
			bookGenreMap[genre].push(book);
		}
	}

	// Sort the genres alphabetically
	return Object.keys(bookGenreMap)
		.sort()
		.map((key) => [key, bookGenreMap[key]] as const);
}
