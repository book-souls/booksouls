import { type LoaderFunctionArgs } from "@remix-run/server-runtime";
import { json, redirect } from "@vercel/remix";
import { createServerClient } from "~/supabase/client.server";
import { getBookImageUrl } from "~/supabase/helpers/storage";

export async function loader({ request }: LoaderFunctionArgs) {
	const headers = new Headers();
	const supabase = createServerClient(request, headers);
	const { data, error } = await supabase.auth.getUser();
	if (error) {
		return redirect("/sign-in");
	}
	const user = data.user;
	const books = await supabase
		.from("user_library")
		.select("book:books!inner(id,title,image:image_file_name)")
		.eq("user_id", user.id);
	if (books.error) {
		throw books.error;
	}
	for (const { book } of books.data) {
		book.image = getBookImageUrl(supabase, book.image);
	}
	return json({ books: books.data }, { headers });
}
