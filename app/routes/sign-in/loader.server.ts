import { json, redirect, type LoaderFunctionArgs } from "@vercel/remix";
import { createServerClient } from "~/supabase/client.server";

export async function loader({ request }: LoaderFunctionArgs) {
	const headers = new Headers();
	const supabase = createServerClient(request.headers, headers);
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (user !== null) {
		return redirect("/", { headers });
	}

	return json(null, { headers });
}
