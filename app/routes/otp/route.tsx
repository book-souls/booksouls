import { Form, useActionData, useLoaderData, useNavigation, useSubmit } from "@remix-run/react";
import * as pinInput from "@zag-js/pin-input";
import { normalizeProps, useMachine } from "@zag-js/react";
import { Loader2Icon } from "lucide-react";
import { useEffect, useId, useRef } from "react";
import { toast } from "sonner";
import { useMounted } from "~/hooks/mounted";
import { action } from "./action.server";
import { loader } from "./loader.server";

export { action, loader };

export default function OTP() {
	const { email } = useLoaderData<typeof loader>();
	const actionData = useActionData<typeof action>();

	const formRef = useRef<HTMLFormElement>(null);
	const submit = useSubmit();

	return (
		<main className="flex h-screen items-center justify-center p-8">
			<Form ref={formRef} method="post">
				<h1 className="text-center text-2xl font-medium">Verify Your Account</h1>
				<p className="mt-4 text-center text-sm">Enter the 6-digit code sent to {email}</p>
				<OTPInput otp={actionData?.otp} onComplete={() => submit(formRef.current)} />
				<VerifyButton />
			</Form>
			<ErrorToast error={actionData?.error} />
		</main>
	);
}

function OTPInput({ otp, onComplete }: { otp: string[] | undefined; onComplete: () => void }) {
	const id = useId();
	const [state, send] = useMachine(
		pinInput.machine({
			id,
			type: "numeric",
			otp: true,
			value: otp,
			onValueComplete: onComplete,
		}),
	);
	const api = pinInput.connect(state, send, normalizeProps);

	// If JS hasn't yet loaded, we use HTML validation because it doesn't need
	// JS to work. Otherwise, we don't limit the input length to 1 because
	// it prevents pasting the entire OTP code at once.
	const mounted = useMounted();
	const maxLength = mounted ? undefined : 1;

	return (
		<div {...api.rootProps} className="flex items-center justify-center gap-2 pb-6 pt-8">
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

function VerifyButton() {
	const navigation = useNavigation();
	const loading = navigation.state === "submitting";
	return (
		<button
			type="submit"
			aria-disabled={loading}
			aria-label={loading ? "Verifying" : "Verify"}
			className="mx-auto flex h-10 w-32 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary-light to-primary px-10 text-on-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary [&_svg]:size-5"
		>
			<span>Verify</span>
			{loading && <Loader2Icon className="shrink-0 animate-spin" />}
		</button>
	);
}

function ErrorToast({ error }: { error: string | undefined }) {
	const navigation = useNavigation();
	const idle = navigation.state === "idle";

	useEffect(() => {
		if (!idle || error === undefined) {
			return;
		}

		toast.error("Failed to verify code", { description: error });
	}, [idle, error]);

	return null;
}
