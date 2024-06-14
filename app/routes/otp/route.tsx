import { Form, useActionData, useLoaderData, useNavigation, useSubmit } from "@remix-run/react";
import * as pinInput from "@zag-js/pin-input";
import { normalizeProps, useMachine } from "@zag-js/react";
import { Loader2Icon } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { toast } from "sonner";
import { action } from "./action.server";
import { loader } from "./loader.server";

export { action, loader };

export default function Page() {
	const { email } = useLoaderData<typeof loader>();
	const actionData = useActionData<typeof action>();

	const formRef = useRef<HTMLFormElement>(null);
	const submit = useSubmit();

	return (
		<main className="flex h-screen items-center justify-center p-8">
			<Form ref={formRef} method="post">
				<h1 className="text-center text-2xl font-medium">Verify Your Account</h1>
				<p className="mt-4 text-center text-sm">Enter the 6-digit code sent to {email}</p>
				<OTPInput otp={actionData?.otp} onValueComplete={() => submit(formRef.current)} />
				<VerifyButton error={actionData?.error} />
			</Form>
		</main>
	);
}

function OTPInput({
	otp,
	onValueComplete,
}: {
	otp: string[] | undefined;
	onValueComplete: () => void;
}) {
	const id = useId();
	const [state, send] = useMachine(
		pinInput.machine({
			id,
			type: "numeric",
			otp: true,
			value: otp,
			onValueComplete,
		}),
	);
	const api = pinInput.connect(state, send, normalizeProps);

	// If JS hasn't yet loaded, we use native HTML validation to set maxLength to 1.
	// After JS loads, we don't limit the input length because that prevents pasting
	// the entire OTP code at once. Zag handles correctly handles input validation.
	const [maxLength, setMaxLength] = useState<number | undefined>(1);
	useEffect(() => {
		setMaxLength(undefined);
	}, []);

	return (
		<div {...api.getRootProps()} className="flex items-center justify-center gap-2 pb-6 pt-8">
			{Array(6)
				.fill(null)
				.map((_, i) => (
					<input
						key={i}
						{...api.getInputProps({ index: i })}
						name="otp"
						required
						pattern="[0-9]"
						maxLength={maxLength}
						className="h-14 w-14 rounded bg-primary/20 text-center text-lg font-medium text-surface placeholder:text-current focus:outline focus:outline-2 focus:outline-current focus:placeholder:text-transparent"
					/>
				))}
		</div>
	);
}

function VerifyButton({ error }: { error: string | undefined }) {
	const navigation = useNavigation();
	const idle = navigation.state === "idle";
	const submitting = navigation.state === "submitting";

	useEffect(() => {
		if (!idle || error === undefined) {
			return;
		}

		toast.error("Failed to verify code", { description: error });
	}, [idle, error]);

	return (
		<button
			type="submit"
			aria-disabled={submitting}
			aria-label={submitting ? "Verifying" : "Verify"}
			className="button mx-auto flex"
		>
			<span>Verify</span>
			{submitting && <Loader2Icon className="shrink-0 animate-spin" />}
		</button>
	);
}
