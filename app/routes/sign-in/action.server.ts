import { json, redirect, type ActionFunctionArgs } from "@vercel/remix";
import { parse } from "valibot";
import { createServerClient } from "~/supabase/client.server";
import { setSignInCookie } from "./cookie.server";
import { EmailSchema } from "./validate";

export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData();
	const email = parse(EmailSchema, formData.get("email"));

	const headers = new Headers();
	const supabase = createServerClient(request, headers);
	const { error } = await supabase.auth.signInWithOtp({ email });

	if (error !== null) {
		console.error(error);
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

	await setSignInCookie(headers, email);
	return redirect("/otp", { headers });
}
