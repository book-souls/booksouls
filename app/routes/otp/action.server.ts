import { json, redirect, type ActionFunctionArgs } from "@vercel/remix";
import { createServerClient } from "~/supabase/client.server";
import { isDigit, isEmail } from "~/utils/validate";
import { deleteEmailCookie, getEmailCookie } from "../sign-in/cookie.server";

export async function action({ request }: ActionFunctionArgs) {
	const email = await getEmailCookie(request.headers);
	if (!isEmail(email)) {
		// Make sure the user navigated to this page from the sign in page.
		return redirect("/sign-in");
	}

	const formData = await request.formData();
	const otp = formData.getAll("otp");
	if (otp.length !== 6 || !otp.every(isDigit)) {
		throw new Error(`Invalid otp: ${otp}`);
	}

	const headers = new Headers();
	const supabase = createServerClient(request.headers, headers);
	const { error } = await supabase.auth.verifyOtp({
		email,
		token: otp.join(""),
		type: "email",
	});

	if (error !== null) {
		console.error("Failed to verify otp:", error);
		return json(
			{
				error: error.message,
				otp,
			},
			{
				headers,
				status: error.status ?? 500,
			},
		);
	}

	await deleteEmailCookie(headers);
	return redirect("/", { headers });
}
