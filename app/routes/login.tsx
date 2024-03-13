import type { ActionFunctionArgs } from "@remix-run/node";
import { Form, Link } from "@remix-run/react";
import LoginLogo from "~/assets/login.svg?react";
import { Logo } from "~/components/Logo";

export async function action({ request }: ActionFunctionArgs) {
	const formDate = await request.formData();
	const email = String(formDate.get("email"));
	const password = String(formDate.get("password"));
	console.log(email, password);
	return null;
}

export default function Login() {
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
					Not a member?{" "}
					<Link to="#" className="text-red-500">
						Sign up now
					</Link>
				</p>
				<Form method="post" className="w-[600px]">
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
						/>
					</div>
					<button
						type="submit"
						className="mx-auto mt-8 flex h-10 items-center justify-center rounded-xl bg-gradient-to-r from-primary-light to-primary px-20 text-on-primary"
					>
						Sign in
					</button>
				</Form>
			</main>
		</div>
	);
}
