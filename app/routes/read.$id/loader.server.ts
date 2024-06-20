import type { LoaderFunctionArgs } from "@vercel/remix";
import { createServerClient, type SupabaseClient } from "~/supabase/client.server";
import { bookNotFound } from "~/utils/not-found";

export function loader({ request, params }: LoaderFunctionArgs) {
	const id = Number(params.id);
	if (!Number.isInteger(id)) {
		throw bookNotFound();
	}

	const supabase = createServerClient(request.headers);
	return getBook(supabase, id);
}

async function getBook(supabase: SupabaseClient, id: number) {
	const { data: book, error } = await supabase
		.from("books")
		.select("title, epub")
		.eq("id", id)
		.maybeSingle();

	if (error !== null) {
		throw error;
	}

	if (book === null) {
		throw bookNotFound();
	}

	return book;
}
