import { json, redirect, type LoaderFunctionArgs } from "@vercel/remix";
import { createServerClient } from "~/supabase/client.server";
import { isEmail } from "~/utils/validate";
import { getEmailCookie } from "../sign-in/cookie.server";

export async function loader({ request }: LoaderFunctionArgs) {
	const email = await getEmailCookie(request.headers);
	if (!isEmail(email)) {
		// Make sure the user navigated to this page from the sign in page.
		return redirect("/sign-in");
	}

	const headers = new Headers();
	const supabase = createServerClient(request.headers, headers);
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (user !== null) {
		return redirect("/", { headers });
	}

	return json({ email }, { headers });
}
