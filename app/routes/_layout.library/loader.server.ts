import { json, type LoaderFunctionArgs } from "@vercel/remix";
import { createServerClient, type SupabaseClient } from "~/supabase/client.server";
import { requireAuth } from "~/utils/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
	const headers = new Headers();
	const supabase = createServerClient(request.headers, headers);
	const user = await requireAuth(supabase, headers);
	const books = await getLibraryBooks(supabase, user.id);
	return json({ books }, { headers });
}

async function getLibraryBooks(supabase: SupabaseClient, userId: string) {
	const { data: books, error } = await supabase
		.from("user_library")
		.select(
			"book:books!inner (id, title, author, image, imageScaled:image_scaled, shortDescription:short_description)",
		)
		.eq("user_id", userId);

	if (error !== null) {
		throw error;
	}

	return books.map(({ book }) => book);
}

export type FavoriteBook = Awaited<ReturnType<typeof getLibraryBooks>>[number];
