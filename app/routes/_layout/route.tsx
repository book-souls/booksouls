import { Link, Outlet, useLoaderData } from "@remix-run/react";
import type { User } from "@supabase/supabase-js";
import * as popover from "@zag-js/popover";
import { normalizeProps, Portal, useMachine } from "@zag-js/react";
import { Loader2Icon, LogInIcon, LogOutIcon, SearchIcon, XIcon } from "lucide-react";
import { useId } from "react";
import CrueltyFreeIcon from "~/assets/cruelty-free.svg?react";
import footerLogo from "~/assets/footer-logo.svg";
import { Logo } from "~/components/Logo";
import { useSignOut } from "../api.sign-out/use-sign-out";
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
		<header className="flex flex-col justify-center bg-surface px-6 text-on-surface">
			<div className="flex items-center justify-between">
				<Link to="/">
					<Logo scale={0.75} />
				</Link>
				<nav>
					<ul className="flex items-center justify-center gap-16">
						<li>
							<NavLink to="/">Home</NavLink>
						</li>
						<li>
							<NavLink to="/categories">Categories</NavLink>
						</li>
						<li>
							<NavLink to="/authors">Authors</NavLink>
						</li>
						{user !== null && (
							<li>
								<NavLink to="/library">Library</NavLink>
							</li>
						)}
					</ul>
				</nav>
				<div className="flex items-center gap-6">
					<Link
						to="/explore"
						className="flex h-10 items-center justify-center gap-2 rounded-lg bg-on-surface px-3 text-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-on-surface"
					>
						<span className="text-sm font-medium">Explore</span>
						<SearchIcon className="size-5" />
					</Link>
					{user !== null ? <UserAvatar user={user} /> : <SignInLink />}
				</div>
			</div>
		</header>
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
				{...api.triggerProps}
				aria-label="Open profile menu"
				className="icon-button bg-primary-light text-xl text-on-primary focus-visible:outline-offset-2 focus-visible:outline-primary-light"
			>
				{user?.email?.at(0)?.toUpperCase()}
			</button>
			<Portal>
				<div {...api.positionerProps}>
					<div
						{...api.contentProps}
						className="relative !block rounded-lg bg-background p-4 text-on-background opacity-0 transition-opacity duration-200 data-[state='open']:opacity-100"
					>
						<div
							{...api.arrowProps}
							className="[--arrow-background:theme(colors.background.DEFAULT)] [--arrow-size:8px]"
						>
							<div {...api.arrowTipProps} />
						</div>
						<button
							{...api.closeTriggerProps}
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
			</Portal>
		</div>
	);
}

function SignOutButton() {
	const { signOut, loading } = useSignOut();
	return (
		<button
			aria-disabled={loading}
			className="mx-auto flex h-10 items-center justify-center gap-2 rounded-lg bg-red-700 px-6 text-sm text-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700 [&_svg]:size-4"
			onClick={signOut}
		>
			Sign Out
			{loading ? <Loader2Icon className="animate-spin" /> : <LogOutIcon />}
		</button>
	);
}

function SignInLink() {
	return (
		<Link to="/sign-in" title="Sign in" className="icon-button">
			<LogInIcon />
		</Link>
	);
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
	return (
		<Link
			to={to}
			className="
				relative select-none text-lg
				before:absolute before:-bottom-0.5 before:right-1/2 before:h-px before:w-1/2 before:origin-right before:scale-x-0 before:bg-current before:transition-transform before:duration-500
				after:absolute after:-bottom-0.5 after:left-1/2 after:h-px after:w-1/2 after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-500
				hover:before:scale-x-100 hover:after:scale-x-100
				focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current focus-visible:before:hidden focus-visible:after:hidden
			"
		>
			{children}
		</Link>
	);
}

function Footer() {
	return (
		<footer className="relative bg-surface p-5 text-on-surface">
			<div className="flex justify-between">
				<div className="w-[200px]">
					<img
						src={footerLogo}
						alt="Book Souls"
						width={158.25}
						height={148.5}
						className="mx-auto"
					/>
					<p className="text-center text-sm font-light">
						Get Engulphed and Explore a New Magical World
					</p>
				</div>
				<div className="mt-6 flex justify-center gap-20">
					<FooterAboutNav />
					<FooterCustomerCareNav />
				</div>
				<div className="mt-6">
					<EmailContactForm />
				</div>
			</div>
			<p className="mt-12 font-light">Copyright © 2024 Book Souls Inc. All rights reserved.</p>
			<CrueltyFreeIcon role="img" aria-label="Cruelty free" className="absolute bottom-5 right-5" />
		</footer>
	);
}

function FooterAboutNav() {
	const headerId = useId();
	return (
		<nav aria-labelledby={headerId}>
			<h3 id={headerId} className="text-xl font-medium uppercase">
				About
			</h3>
			<ul className="mt-6 flex flex-col gap-3">
				<li>
					<NavLink to="/about">About Us</NavLink>
				</li>
				<li>
					<NavLink to="/terms-and-privacy">Terms & Privacy</NavLink>
				</li>
			</ul>
		</nav>
	);
}

function FooterCustomerCareNav() {
	const headerId = useId();
	return (
		<nav aria-labelledby={headerId}>
			<h3 id={headerId} className="text-xl font-medium uppercase">
				Customer Care
			</h3>
			<ul className="mt-6 flex flex-col gap-3">
				<li>
					<NavLink to="/contact-us">Contact Us</NavLink>
				</li>
				<li>
					<NavLink to="/faq">Frequently Asked Questions</NavLink>
				</li>
			</ul>
		</nav>
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
					className="h-10 w-[200px] bg-transparent px-2 py-1 placeholder:text-on-surface/50 focus:outline-none"
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
