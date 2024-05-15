import { json, type ActionFunctionArgs } from "@vercel/remix";
import { createServerClient } from "~/supabase/client.server";
import { requireAuth } from "~/supabase/helpers/auth.server";
import { isFavoriteBook } from "./loader.server";

export async function action({ request, params }: ActionFunctionArgs) {
	const headers = new Headers();
	const supabase = createServerClient(request, headers);
	const user = await requireAuth(supabase, headers);

	const bookId = Number(params.id);
	const favorite = await isFavoriteBook(supabase, user, bookId);

	if (favorite) {
		await supabase
			.from("user_library")
			.delete()
			.eq("user_id", user.id)
			.eq("book_id", bookId)
			.throwOnError();
	} else {
		await supabase
			.from("user_library")
			.insert({
				user_id: user.id,
				book_id: bookId,
			})
			.throwOnError();
	}

	return json(null, { headers });
}
