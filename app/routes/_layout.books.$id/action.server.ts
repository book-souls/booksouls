import { json, type ActionFunctionArgs } from "@vercel/remix";
import { createServerClient } from "~/supabase/client.server";
import { requireAuth } from "~/utils/auth.server";
import { bookNotFound } from "~/utils/not-found";
import { isFavoriteBook } from "./loader.server";

export async function action({ request, params }: ActionFunctionArgs) {
	const id = Number(params.id);
	if (!Number.isInteger(id)) {
		throw bookNotFound();
	}

	const headers = new Headers();
	const supabase = createServerClient(request.headers, headers);
	const user = await requireAuth(supabase, headers);

	try {
		const favorite = await isFavoriteBook(supabase, user, id);
		if (favorite) {
			await supabase
				.from("user_library")
				.delete()
				.eq("book_id", id)
				.eq("user_id", user.id)
				.throwOnError();
		} else {
			await supabase
				.from("user_library")
				.insert({
					book_id: id,
					user_id: user.id,
				})
				.throwOnError();
		}
		return json({ error: false }, { headers });
	} catch (error) {
		console.error("Failed to update user_library table:", error);
		return json({ error: true }, { headers });
	}
}
