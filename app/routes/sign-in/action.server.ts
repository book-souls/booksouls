import { json, redirect, type ActionFunctionArgs } from "@vercel/remix";
import { createServerClient } from "~/supabase/client.server";
import { isEmail } from "~/utils/validate";
import { setEmailCookie } from "./cookie.server";

export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData();
	const email = formData.get("email");
	if (!isEmail(email)) {
		throw new Error(`Invalid email: ${email}`);
	}

	const headers = new Headers();
	const supabase = createServerClient(request.headers, headers);
	const { error } = await supabase.auth.signInWithOtp({ email });

	if (error !== null) {
		console.error("Failed to sign in:", error);
		return json(
			{
				error: error.message,
				email,
			},
			{
				status: error.status ?? 500,
				headers,
			},
		);
	}

	await setEmailCookie(headers, email);
	return redirect("/otp", { headers });
}
