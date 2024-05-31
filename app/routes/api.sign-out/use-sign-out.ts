import { useFetcher } from "@remix-run/react";
import type { action } from "./action.server";

export function useSignOut() {
	const fetcher = useFetcher<typeof action>();
	const state = fetcher.state;
	const error = fetcher.data?.error;

	function submit() {
		if (state === "submitting") {
			return;
		}

		fetcher.submit(null, {
			action: "/api/sign-out",
			method: "post",
		});
	}

	return { submit, state, error };
}
