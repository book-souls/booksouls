import type { ActionFunctionArgs } from "@vercel/remix";
import { json, redirect } from "@vercel/remix";
import { createServerClient, type SupabaseClient } from "~/supabase/client.server";
import { generateSearchEmbedding, preprocessSearchQuery } from "~/supabase/helpers/search.server";
import { getBookImageUrl } from "~/supabase/helpers/storage";

export async function action({ request, params }: ActionFunctionArgs) {
	const formData = await request.formData();
	const fav = String(formData.get("fav"));

	const supabase = createServerClient(request);
	const { data, error } = await supabase.auth.getUser();
	if (error) {
		return redirect("/sign-in");
	}
	const user = data.user;
	const id = Number(params.id);
	if (fav == "true") {
		await supabase.from("user_library").delete().eq("user_id", user.id).eq("book_id", id);
	} else {
		await supabase.from("user_library").insert({ user_id: user.id, book_id: id });
	}
	return null;
}
