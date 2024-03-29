import { json, type ActionFunctionArgs } from "@remix-run/node";
import { email, parse, string } from "valibot";
import { createServerClient } from "~/supabase/client.server";

const emailSchema = string([email()]);

export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData();
	const email = parse(emailSchema, formData.get("email"));

	const supabase = createServerClient(request);
	const { error } = await supabase.auth.signInWithOtp({ email });

	if (error !== null) {
		console.error(error);
		return json(
			{
				error: error.message,
				email,
			},
			{ status: error.status ?? 500 },
		);
	}

	return {
		error: null,
		email,
	};
}
