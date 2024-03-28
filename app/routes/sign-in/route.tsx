import { Form, Link, useActionData, useNavigation } from "@remix-run/react";
import { Loader2Icon } from "lucide-react";
import { useEffect, useId } from "react";
import { toast, Toaster } from "sonner";
import LoginIcon from "~/assets/login.svg?react";
import { Logo } from "~/components/Logo";
import { action } from "./action.server";

export { action };

export default function SignIn() {
	const actionData = useActionData<typeof action>();
	return (
		<div className="flex h-screen min-h-[550px]">
			<aside className="relative flex w-[30%] min-w-[300px] flex-col items-center justify-center gap-8 bg-surface p-8 text-on-surface">
				<Link
					to="/"
					className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
				>
					<Logo scale={0.8} />
				</Link>
				<LoginIcon role="img" aria-label="A person reading a book" className="h-auto w-[250px]" />
			</aside>
			<main className="relative flex grow items-center justify-center p-8">
				<Form method="post" className="w-[400px] max-w-full">
					<h1 className="text-center text-3xl font-medium">Sign in to Book Souls</h1>
					<EmailInput defaultValue={actionData?.email} />
					<SignInButton />
				</Form>
			</main>
			<ErrorToaster error={actionData?.error} />
		</div>
	);
}

function EmailInput({ defaultValue }: { defaultValue?: string }) {
	const inputId = useId();
	return (
		<div className="flex flex-col gap-1 pt-8">
			<label className="font-medium" htmlFor={inputId}>
				Email Address
			</label>
			<input
				id={inputId}
				type="email"
				name="email"
				defaultValue={defaultValue}
				required
				autoComplete="email"
				className="h-10 rounded-md bg-primary/20 px-3 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-primary"
			/>
		</div>
	);
}

function SignInButton() {
	const navigation = useNavigation();
	const submitting = navigation.state === "submitting";
	return (
		<button
			type="submit"
			aria-disabled={submitting}
			className="mx-auto mt-6 flex h-10 w-[200px] items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary-light to-primary text-on-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
		>
			{submitting && <Loader2Icon aria-label="Loading" className="animate-spin" />}
			<span>Sign In</span>
		</button>
	);
}

function ErrorToaster({ error }: { error: string | null | undefined }) {
	const navigation = useNavigation();
	const idle = navigation.state === "idle";

	useEffect(() => {
		if (!idle || error === undefined) {
			return;
		}

		if (error !== null) {
			toast.error("Failed to sign in", { description: error });
		} else {
			toast.success("Check your inbox for a sign in link");
		}
	}, [idle, error]);

	return <Toaster richColors closeButton />;
}
