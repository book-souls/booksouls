import { json, redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { createServerClient } from "~/supabase/client.server";
import { deleteSignInCookie, getSignInCookie } from "../sign-in/cookie.server";

export async function loader({ request }: LoaderFunctionArgs) {
	return { email: "test@gmail.com" };

	const email = await getSignInCookie(request);

	// Make sure the user navigated to this page from the sign in page.
	if (email === null) {
		return redirect("/sign-in");
	}

	const headers = new Headers();
	const supabase = createServerClient(request, headers);
	const { data } = await supabase.auth.getUser();

	if (data.user !== null) {
		return redirect("/", { headers });
	}

	await deleteSignInCookie(headers);
	return json({ email }, { headers });
}
