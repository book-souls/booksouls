import { Transition } from "@headlessui/react";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import type { User } from "@supabase/supabase-js";
import * as menu from "@zag-js/menu";
import * as popover from "@zag-js/popover";
import { normalizeProps, Portal, useMachine } from "@zag-js/react";
import {
	ChevronDownIcon,
	Loader2Icon,
	LogInIcon,
	LogOutIcon,
	SearchIcon,
	XIcon,
} from "lucide-react";
import { useEffect, useId } from "react";
import { toast } from "sonner";
import footerLogo from "~/assets/footer-logo.svg";
import { Logo } from "~/components/Logo";
import { genres } from "~/utils/genres";
import { useSignOutFetcher } from "../api.sign-out/use-sign-out-fetcher";
import { loader } from "./loader.server";

export { loader };

export default function Layout() {
	return (
		<>
			<Header />
			<Outlet />
			<Footer />
		</>
	);
}

function Header() {
	const { user } = useLoaderData<typeof loader>();
	return (
		<header className="flex items-center bg-surface px-6 text-on-surface">
			<div className="mx-auto flex max-w-7xl grow items-center justify-between">
				<Link
					to="/"
					className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
				>
					<Logo scale={0.75} />
				</Link>
				<nav>
					<ul role="list" className="flex items-center justify-center gap-14">
						<li>
							<NavLink to="/">Home</NavLink>
						</li>
						<li>
							<GenresMenu />
						</li>
						<li>
							<NavLink to="/about">About Us</NavLink>
						</li>
						{user !== null && (
							<li>
								<NavLink to="/library">Library</NavLink>
							</li>
						)}
					</ul>
				</nav>
				<div className="flex items-center gap-4">
					<Link to="/search" title="Search" className="icon-button">
						<SearchIcon />
					</Link>
					{user !== null ? <UserAvatar user={user} /> : <SignInLink />}
				</div>
			</div>
		</header>
	);
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
	return (
		<Link
			to={to}
			className="relative select-none text-lg before:absolute before:-bottom-0.5 before:right-1/2 before:h-px before:w-1/2 before:origin-right before:scale-x-0 before:bg-current before:transition-transform before:duration-500 after:absolute after:-bottom-0.5 after:left-1/2 after:h-px after:w-1/2 after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-500 hover:before:scale-x-100 hover:after:scale-x-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current focus-visible:before:hidden focus-visible:after:hidden"
		>
			{children}
		</Link>
	);
}

function GenresMenu() {
	const id = useId();
	const [state, send] = useMachine(menu.machine({ id }));
	const api = menu.connect(state, send, normalizeProps);
	return (
		<>
			<button
				{...api.getTriggerProps()}
				className="flex items-center gap-1 text-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
			>
				Genres
				<span {...api.getIndicatorProps()}>
					<ChevronDownIcon className="size-4" />
				</span>
			</button>
			<Portal>
				<Transition
					show={api.open}
					enter="transition-opacity duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="transition-opacity"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div {...api.getPositionerProps()}>
						<ul
							{...api.getContentProps()}
							role="list"
							className="!block rounded-xl bg-floating p-2 text-on-floating shadow-lg transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-light"
						>
							{genres.map((genre) => (
								<li key={genre}>
									<Link
										{...api.getItemProps({ value: genre })}
										to={`/genres/${genre}`}
										tabIndex={-1}
										className="!block rounded px-2 py-1.5 font-medium data-[highlighted]:bg-primary data-[highlighted]:text-on-primary"
									>
										{genre}
									</Link>
								</li>
							))}
						</ul>
					</div>
				</Transition>
			</Portal>
		</>
	);
}

function UserAvatar({ user }: { user: User }) {
	const id = useId();
	const [state, send] = useMachine(
		popover.machine({
			id,
			modal: true,
		}),
	);
	const api = popover.connect(state, send, normalizeProps);
	return (
		<div>
			<button
				{...api.getTriggerProps()}
				aria-label="Open profile menu"
				className="icon-button bg-primary-light text-xl text-on-primary focus-visible:outline-offset-2 focus-visible:outline-primary-light"
			>
				{user.email?.at(0)?.toUpperCase()}
			</button>
			<Portal>
				<Transition
					show={api.open}
					enter="transition-opacity duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="transition-opacity"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div {...api.getPositionerProps()}>
						<div
							{...api.getContentProps()}
							className="relative !block rounded-lg bg-floating p-4 text-on-floating shadow-lg"
						>
							<div
								{...api.getArrowProps()}
								className="[--arrow-background:theme(colors.floating)] [--arrow-size:8px]"
							>
								<div {...api.getArrowTipProps()} />
							</div>
							<button
								{...api.getCloseTriggerProps()}
								className="icon-button absolute right-2 top-2 size-8 [&_svg]:size-5"
							>
								<XIcon />
							</button>
							<div className="pb-6 pt-4">
								<p className="font-medium">Email</p>
								<p className="text-sm">{user.email}</p>
							</div>
							<SignOutButton />
						</div>
					</div>
				</Transition>
			</Portal>
		</div>
	);
}

function SignOutButton() {
	const fetcher = useSignOutFetcher();
	const loading = fetcher.state === "submitting";

	useEffect(() => {
		if (fetcher.state === "idle" && fetcher.data?.error != null) {
			toast.error("Failed to sign out", { description: fetcher.data.error });
		}
	}, [fetcher]);

	return (
		<fetcher.Form method="post" action="/api/sign-out">
			<button
				aria-disabled={loading}
				className="button mx-auto flex bg-red-700 bg-none text-red-50 focus-visible:outline-red-700"
			>
				Sign Out
				{loading ? <Loader2Icon className="animate-spin" /> : <LogOutIcon />}
			</button>
		</fetcher.Form>
	);
}

function SignInLink() {
	return (
		<Link to="/sign-in" aria-label="Sign in" title="Sign in" className="icon-button">
			<LogInIcon />
		</Link>
	);
}

function Footer() {
	return (
		<footer className="bg-surface p-6 text-on-surface">
			<div className="mx-auto flex max-w-7xl justify-between">
				<div>
					<img src={footerLogo} alt="Book Souls" width={158.25} height={148.5} />
					<p className="mt-3 font-light">Get engulphed and explore a new magical world</p>
				</div>
				<div className="flex flex-col items-end justify-between pt-4">
					<EmailContactForm />
					<p className="mt-12 text-sm font-light">
						Copyright © 2024 Book Souls Inc. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
}

function EmailContactForm() {
	const inputId = useId();
	return (
		<form onSubmit={(e) => e.preventDefault()}>
			<label htmlFor={inputId} className="uppercase">
				Stay in touch
			</label>
			<div className="mt-1 flex border border-on-surface focus-within:outline focus-within:outline-2 focus-within:outline-offset-2">
				<input
					id={inputId}
					type="email"
					placeholder="Email..."
					className="h-10 w-[300px] bg-transparent px-2 py-1 placeholder:text-on-surface/50 focus:outline-none"
				/>
				<button
					type="submit"
					tabIndex={-1}
					className="flex h-10 w-10 items-center justify-center bg-on-surface font-medium uppercase text-surface"
				>
					Go
				</button>
			</div>
		</form>
	);
}
