import { json, redirect, type LoaderFunctionArgs } from "@vercel/remix";
import { createServerClient } from "~/supabase/client.server";

export async function loader({ request }: LoaderFunctionArgs) {
	const headers = new Headers();
	const supabase = createServerClient(request, headers);
	const { data } = await supabase.auth.getUser();

	if (data.user !== null) {
		return redirect("/", { headers });
	}

	return json(null, { headers });
}
