import { json, type LoaderFunctionArgs } from "@vercel/remix";
import { createServerClient, type SupabaseClient } from "~/supabase/client.server";
import { requireAuth } from "~/supabase/helpers/auth.server";
import { getBookImageUrl } from "~/supabase/helpers/storage";

export async function loader({ request }: LoaderFunctionArgs) {
	const headers = new Headers();
	const supabase = createServerClient(request, headers);
	const books = await getLibraryBooks(supabase, headers);
	return json({ books }, { headers });
}

async function getLibraryBooks(supabase: SupabaseClient, headers: Headers) {
	const user = await requireAuth(supabase, headers);
	const { data: books, error } = await supabase
		.from("user_library")
		.select("book:books!inner (id, title, image:image_file_name)")
		.eq("user_id", user.id);

	if (error !== null) {
		throw error;
	}

	for (const { book } of books) {
		book.image = getBookImageUrl(supabase, book.image);
	}

	return books;
}
