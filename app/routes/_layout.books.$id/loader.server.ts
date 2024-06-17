import type { User } from "@supabase/supabase-js";
import { json, type LoaderFunctionArgs } from "@vercel/remix";
import { createServerClient, type SupabaseClient } from "~/supabase/client.server";
import { bookNotFound } from "~/utils/not-found";

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

	const [book, favorite, similarBooks] = await Promise.all([
		getBook(supabase, id),
		isFavoriteBook(supabase, user, id),
		getSimilarBooks(supabase, id),
	]);

	return json({ user, book, favorite, similarBooks }, { headers });
}

async function getBook(supabase: SupabaseClient, id: number) {
	const { data: book, error } = await supabase
		.from("books")
		.select(
			"id, title, genres, shortDescription:short_description, description, image, imageScaled:image_scaled, author",
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

async function getSimilarBooks(supabase: SupabaseClient, id: number) {
	const { data: results, error } = await supabase
		.rpc("book_recommendations", {
			book_id: id,
			match_threshold: 0.5,
			match_limit: 8,
		})
		.select(
			"id, title, image, imageScaled:image_scaled, author, shortDescription:short_description, author",
		);

	if (error !== null) {
		throw error;
	}

	return results;
}

export type SimilarBook = Awaited<ReturnType<typeof getSimilarBooks>>[number];
