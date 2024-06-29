import { useFetcher } from "@remix-run/react";
import type { action } from "./action.server";

export function useSignOutFetcher() {
	return useFetcher<typeof action>();
}
