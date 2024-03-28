import type { ActionFunctionArgs } from "@remix-run/node";
import { createServerClient } from "~/supabase/client.server";
import { validateFormData } from "./validator";

export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData();
	const { email, password } = validateFormData(formData);

	const url = new URL(request.url);
	const supabase = createServerClient(request);
	const { error } = await supabase.auth.signUp({
		email: email,
		password: password,
		options: {
			emailRedirectTo: `${url.origin}/auth/confirm`,
		},
	});

	if (error !== null) {
		console.error(error);
		return {
			error: error.message,
		};
	}

	return { error: null };
}
