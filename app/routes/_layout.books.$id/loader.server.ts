import type { User } from "@supabase/supabase-js";
import { defer, type LoaderFunctionArgs } from "@vercel/remix";
import { createServerClient, type SupabaseClient } from "~/supabase/client.server";
import { bookNotFound } from "~/utils/not-found";
import { generateSearchEmbedding } from "~/utils/search.server";
import { getBooksBucketUrl } from "~/utils/storage";

export async function loader({ params, request }: LoaderFunctionArgs) {
	const id = Number(params.id);
	if (!Number.isInteger(id)) {
		throw bookNotFound();
	}

	const headers = new Headers();
	const supabase = createServerClient(request.headers, headers);
	const {
		data: { user },
	} = await supabase.auth.getUser();

	const [book, favorite] = await Promise.all([
		getBook(supabase, id),
		isFavoriteBook(supabase, user, id),
	]);
	const similarBooks = getSimilarBooks(supabase, book);
	return defer({ book, favorite, user, similarBooks }, { headers });
}

async function getBook(supabase: SupabaseClient, id: number) {
	const { data: book, error } = await supabase
		.from("books")
		.select(
			"id, title, genres, shortDescription:short_description, description, image:image_file_name",
		)
		.eq("id", id)
		.maybeSingle();

	if (error !== null) {
		throw error;
	}

	if (book === null) {
		throw new Response("Book not found", {
			status: 404,
		});
	}

	book.image = getBooksBucketUrl(supabase, book.image);
	return book;
}

export async function isFavoriteBook(supabase: SupabaseClient, user: User | null, id: number) {
	if (user === null) {
		return false;
	}

	const { count } = await supabase
		.from("user_library")
		.select("*", { count: "exact", head: true })
		.eq("user_id", user.id)
		.eq("book_id", id)
		.throwOnError();

	return count !== null && count > 0;
}

async function getSimilarBooks(
	supabase: SupabaseClient,
	book: { id: number; description: string },
) {
	const embedding = await generateSearchEmbedding(book.description);
	const { data: results, error } = await supabase
		.rpc("book_search", {
			query_embedding: JSON.stringify(embedding),
			match_threshold: 0.5,
			match_limit: 9,
		})
		.select("id, title, image:image_file_name, author, shortDescription:short_description");

	if (error !== null) {
		throw error;
	}

	for (const book of results) {
		book.image = getBooksBucketUrl(supabase, book.image);
	}

	// Don't suggest the same book.
	return results.filter(({ id }) => book.id !== id);
}

export type SimilarBooksResult = Awaited<ReturnType<typeof getSimilarBooks>>;
