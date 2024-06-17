import { useFetcher } from "@remix-run/react";
import type { action } from "./action.server";

export function useSignOut() {
	const fetcher = useFetcher<typeof action>();
	const submitting = fetcher.state === "submitting";
	const error = fetcher.data?.error;

	function submit() {
		if (submitting) {
			return;
		}

		fetcher.submit(null, {
			action: "/api/sign-out",
			method: "post",
		});
	}

	return { submit, submitting, error };
}
