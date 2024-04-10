import { json, type ActionFunctionArgs } from "@remix-run/node";
import { createServerClient } from "~/supabase/client.server";

export async function action({ request }: ActionFunctionArgs) {
	const headers = new Headers();
	const supabase = createServerClient(request, headers);

	const { error } = await supabase.auth.signOut();

	if (error !== null) {
		return json(
			{ error: error.message },
			{
				headers,
				status: error.status ?? 500,
			},
		);
	}

	return json({ error: null }, { headers });
}
