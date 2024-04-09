import { useFetcher } from "@remix-run/react";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";
import type { action } from "./action.server";

export function useSignOut() {
	const { state, data, submit } = useFetcher<typeof action>();
	const loading = state === "submitting";
	const error = data?.error;

	const signOut = useCallback(() => {
		submit(null, {
			method: "post",
			action: "/api/sign-out",
		});
	}, [submit]);

	useEffect(() => {
		if (loading || error == null) {
			return;
		}

		toast.error("Failed to sign out", { description: error });
	}, [loading, error]);

	return { signOut, loading };
}
