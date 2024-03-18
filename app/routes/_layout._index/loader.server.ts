import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { createServerClient, type ServerClient } from "~/supabase/client.server";

export async function loader({ request }: LoaderFunctionArgs) {
	const headers = new Headers();
	const supabase = createServerClient(request, headers);
	const books = await getBooks(supabase);
	return json(
		{
			books: groupBooksByGenre(books),
			featuredBooks: books.filter((book) => book.featured),
		},
		{ headers },
	);
}

async function getBooks(supabase: ServerClient) {
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
