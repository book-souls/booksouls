import { Form, Link, useActionData, useNavigation } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { toast, Toaster } from "sonner";
import LoginLogo from "~/assets/login.svg?react";
import { Logo } from "~/components/Logo";
import { action } from "./action.server";

export { action };

export default function SignUp() {
	const actionData = useActionData<typeof action>();
	return (
		<div className="flex h-dvh flex-row">
			<aside className="relative flex w-[30%] flex-col items-center justify-center bg-surface text-on-surface">
				<Link
					to="/"
					className="absolute left-4 top-4 focus-visible:outline focus-visible:outline-current"
				>
					<Logo scale={0.5} />
				</Link>
				<p className="text-center text-4xl font-thin uppercase">Get Engulphed</p>
				<LoginLogo className="mt-10 h-auto w-[90%]" aria-label="A person reading a book" />
			</aside>
			<main className="relative flex w-[70%] items-center justify-center">
				<p className="absolute right-4 top-4">
					Already a Member?{" "}
					<Link to="/sign-in" className="text-red-500">
						Sign in now
					</Link>
				</p>
				<SignUpForm />
			</main>
			<ErrorToaster error={actionData?.error} />
		</div>
	);
}
function SignUpForm() {
	const password = useRef<HTMLInputElement>(null);
	const confirmPassword = useRef<HTMLInputElement>(null);
	function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		if (password.current?.value !== confirmPassword.current?.value) {
			e.preventDefault();
			confirmPassword.current?.setCustomValidity("Passwords do not match");
			confirmPassword.current?.reportValidity();
			return;
		}
	}
	return (
		<Form method="post" className="w-[600px]" onSubmit={onSubmit}>
			<h1 className="text-3xl font-medium">Sign in to Book Souls</h1>
			<div className="mt-6 flex flex-col gap-2">
				<label className="text-lg font-medium" htmlFor="email">
					Email Address
				</label>
				<input
					autoComplete="email"
					className="h-10 rounded-lg bg-primary/30 px-3 shadow-inner focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-primary"
					type="email"
					id="email"
					name="email"
					required
				/>
			</div>
			<div className="mt-4 flex flex-col gap-2">
				<label className="text-lg font-medium" htmlFor="password">
					Password
				</label>
				<input
					autoComplete="current-password"
					className="h-10 rounded-lg bg-primary/30 px-3 shadow-inner focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-primary"
					type="password"
					id="password"
					name="password"
					ref={password}
					required
					minLength={8}
				/>
			</div>
			<div className="mt-4 flex flex-col gap-2">
				<label className="text-lg font-medium" htmlFor="confirmPassword">
					Confirm Password
				</label>
				<input
					autoComplete="current-password"
					className="h-10 rounded-lg bg-primary/30 px-3 shadow-inner focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-primary"
					type="password"
					id="confirmPassword"
					name="confirmPassword"
					ref={confirmPassword}
					required
					minLength={8}
				/>
			</div>
			<button
				type="submit"
				className="mx-auto mt-8 flex h-10 items-center justify-center rounded-xl bg-gradient-to-r from-primary-light to-primary px-20 text-on-primary"
			>
				Sign up
			</button>
		</Form>
	);
}
function ErrorToaster({ error }: { error: string | undefined | null }) {
	const navigation = useNavigation();
	const idle = navigation.state === "idle";

	useEffect(() => {
		if (!idle || error === undefined) {
			return;
		}
		if (error) {
			toast.error("Failed to Sign Up", { description: error });
		} else {
			toast.success("An email will be sent to confirm signup");
		}
	}, [idle, error]);

	return <Toaster richColors closeButton />;
}
