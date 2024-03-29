import { redirect, type LoaderFunctionArgs } from "@remix-run/node";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createServerClient } from "~/supabase/client.server";

export async function loader({ request }: LoaderFunctionArgs) {
	const url = new URL(request.url);
	const tokenHash = url.searchParams.get("token_hash");
	const type = url.searchParams.get("type") as EmailOtpType | null;
	const next = url.searchParams.get("next") || "/";

	if (!tokenHash || !type) {
		return new Response('"token_hash" and "type" are required', {
			status: 400,
		});
	}

	const headers = new Headers();
	const supabase = createServerClient(request, headers);
	const { error } = await supabase.auth.verifyOtp({
		type,
		token_hash: tokenHash,
	});

	if (error !== null) {
		console.error(error);
		return new Response("Failed to verify OTP", {
			status: 500,
			headers,
		});
	}

	return redirect(next, { headers });
}
