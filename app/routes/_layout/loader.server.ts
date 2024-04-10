import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { createServerClient } from "~/supabase/client.server";

export async function loader({ request }: LoaderFunctionArgs) {
	const headers = new Headers();
	const supabase = createServerClient(request, headers);

	const {
		data: { session },
		error,
	} = await supabase.auth.getSession();

	if (error !== null) {
		throw error;
	}

	return json({ session }, { headers });
}
