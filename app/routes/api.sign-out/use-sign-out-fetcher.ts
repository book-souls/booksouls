import { useFetcher } from "@remix-run/react";
import type { action } from "./action.server";

export function useSignOutFetcher() {
	const { submit, state, data } = useFetcher<typeof action>();
	return {
		signOut() {
			submit(null, {
				action: "/api/sign-out",
				method: "post",
			});
		},
		state,
		data,
	};
}
