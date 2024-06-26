import { useFetcher } from "@remix-run/react";
import type { action } from "./action.server";

export function useSummarizeFetcher() {
	const { submit, state, data } = useFetcher<typeof action>();
	return {
		summarize(text: string) {
			submit(text, {
				action: "/api/summarize",
				method: "post",
				encType: "text/plain",
			});
		},
		state,
		data,
	};
}

export type SummarizeFetcher = ReturnType<typeof useSummarizeFetcher>;
