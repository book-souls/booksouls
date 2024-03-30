import { json, redirect, type ActionFunctionArgs } from "@remix-run/node";
import { array, length, parse, regex, string } from "valibot";
import { createServerClient } from "~/supabase/client.server";
import { getSignInCookie } from "../sign-in/cookie.server";

const DigitSchema = string([regex(/^[0-9]$/)]);
const OTPSchema = array(DigitSchema, [length(6)]);

export async function action({ request }: ActionFunctionArgs) {
	const email = await getSignInCookie(request);

	// Make sure the user navigated to this page from the sign in page.
	if (email === null) {
		return redirect("/sign-in");
	}

	const formData = await request.formData();
	const otp = parse(OTPSchema, formData.getAll("otp")).join("");

	const headers = new Headers();
	const supabase = createServerClient(request, headers);
	const { error } = await supabase.auth.verifyOtp({
		email,
		token: otp,
		type: "email",
	});

	if (error !== null) {
		console.error(error);
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

	return redirect("/", { headers });
}
