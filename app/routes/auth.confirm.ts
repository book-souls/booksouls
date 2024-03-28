import { redirect } from "@remix-run/node";
import { createServerClient } from "~/supabase/client.server";

export async function loader(request: Request) {
	const { searchParams } = new URL(request.url);
	const token_hash = searchParams.get("token_hash");
	const type = searchParams.get("type");
	const next = searchParams.get("next") ?? "/";

	if (token_hash && type) {
		const headers = new Headers();
		const supabase = createServerClient(request, headers);

		const { error } = await supabase.auth.verifyOtp({
			type: type as any,
			token_hash,
		});
		if (!error) {
			return redirect(next, { headers });
		}
	}

	return null;
}
