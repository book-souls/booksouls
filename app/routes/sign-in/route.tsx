import { Form, Link, useActionData, useNavigation } from "@remix-run/react";
import { Loader2Icon, LogInIcon } from "lucide-react";
import { useEffect, useId } from "react";
import { toast } from "sonner";
import LoginSidebarIcon from "~/assets/login-sidebar.svg?react";
import { Logo } from "~/components/Logo";
import { action } from "./action.server";
import { loader } from "./loader.server";

export { action, loader };

export default function Page() {
	const actionData = useActionData<typeof action>();
	return (
		<div className="flex h-screen min-h-[400px]">
			<aside className="relative flex w-1/3 min-w-[325px] flex-col items-center justify-center gap-8 bg-surface text-on-surface">
				<Link
					to="/"
					className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
				>
					<Logo scale={0.8} />
				</Link>
				<LoginSidebarIcon
					role="img"
					aria-label="A person reading a book"
					className="h-auto w-[275px]"
				/>
			</aside>
			<main className="flex grow items-center justify-center p-8">
				<Form method="post">
					<h1 className="text-3xl font-medium">Sign in to Book Souls</h1>
					<EmailInput defaultValue={actionData?.email} />
					<SignInButton error={actionData?.error} />
				</Form>
			</main>
		</div>
	);
}

function EmailInput({ defaultValue }: { defaultValue?: string }) {
	const inputId = useId();
	const descriptionId = `${inputId}-description`;
	return (
		<div className="flex flex-col pb-6 pt-8">
			<label htmlFor={inputId} className="mb-1 font-medium">
				Email Address
			</label>
			<input
				id={inputId}
				type="email"
				name="email"
				defaultValue={defaultValue}
				required
				autoComplete="email"
				aria-describedby={descriptionId}
				className="h-12 rounded-md bg-primary/20 px-3 text-surface focus:outline focus:outline-2 focus:outline-current"
			/>
			<p id={descriptionId} className="mt-2 text-sm">
				If this is your first time signing in, a new account will be created.
			</p>
		</div>
	);
}

function SignInButton({ error }: { error: string | undefined }) {
	const navigation = useNavigation();
	const idle = navigation.state === "idle";
	const submitting = navigation.state === "submitting";

	useEffect(() => {
		if (!idle || error === undefined) {
			return;
		}

		toast.error("Failed to sign in", { description: error });
	}, [idle, error]);

	return (
		<button
			type="submit"
			aria-disabled={submitting}
			aria-label={submitting ? "Signing in" : "Sign In"}
			className="button mx-auto flex"
		>
			<span>Sign In</span>
			{submitting ? <Loader2Icon className="animate-spin" /> : <LogInIcon />}
		</button>
	);
}
