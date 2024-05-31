import { useFetcher } from "@remix-run/react";
import type { action } from "./action.server";

export function useSummarize() {
	const fetcher = useFetcher<typeof action>();
	const state = fetcher.state;
	const summary = fetcher.data?.summary;
	const error = fetcher.data?.error;

	function submit(text: string) {
		fetcher.submit(text, {
			action: "/api/summarize",
			method: "post",
			encType: "text/plain",
		});
	}

	return { submit, state, summary, error };
}
