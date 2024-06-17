import { useFetcher } from "@remix-run/react";
import type { action } from "./action.server";

export function useSummarize() {
	const fetcher = useFetcher<typeof action>();
	const submitting = fetcher.state === "submitting";
	const summary = fetcher.data?.summary;
	const error = fetcher.data?.error;

	function submit(text: string) {
		fetcher.submit(text, {
			action: "/api/summarize",
			method: "post",
			encType: "text/plain",
		});
	}

	return { submit, submitting, summary, error };
}
