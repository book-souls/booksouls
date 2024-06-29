import { useFetcher } from "@remix-run/react";
import type { action } from "./action.server";

export function useSearchFetcher() {
	return useFetcher<typeof action>();
}
