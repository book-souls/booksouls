import { type LoaderFunctionArgs } from "@vercel/remix";
import { createServerClient, type SupabaseClient } from "~/supabase/client.server";
import { getBooksBucketUrl } from "~/supabase/helpers/storage";

export async function loader({ request, params }: LoaderFunctionArgs) {
	const supabase = createServerClient(request);
	const id = String(params.id);
	const book = await getBook(supabase, id);

	if (book === null) {
		throw new Response("Book not found", {
			status: 404,
		});
	}

	return book;
}

async function getBook(supabase: SupabaseClient, id: string) {
	const { data: book, error } = await supabase
		.from("books")
		.select("title, epubUrl:epub_file_name")
		.eq("id", id)
		.maybeSingle();

	if (error !== null) {
		throw error;
	}

	if (book === null) {
		return null;
	}

	book.epubUrl = getBooksBucketUrl(supabase, book.epubUrl);
	return book;
}
