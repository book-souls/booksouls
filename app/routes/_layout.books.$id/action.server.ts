import { json, type ActionFunctionArgs } from "@vercel/remix";
import { createServerClient } from "~/supabase/client.server";
import { requireAuth } from "~/supabase/helpers/auth.server";

export async function action({ request, params }: ActionFunctionArgs) {
	const formData = await request.formData();
	const favorite = String(formData.get("favorite"));

	const headers = new Headers();
	const supabase = createServerClient(request, headers);
	const user = await requireAuth(supabase, headers);

	const id = Number(params.id);
	if (favorite === "true") {
		await supabase
			.from("user_library")
			.delete()
			.eq("user_id", user.id)
			.eq("book_id", id)
			.throwOnError();
	} else if (favorite === "false") {
		await supabase
			.from("user_library")
			.insert({
				user_id: user.id,
				book_id: id,
			})
			.throwOnError();
	}

	return json(null, { headers });
}
