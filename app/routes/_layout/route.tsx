import { Form, Link, Outlet } from "@remix-run/react";
import { SearchIcon, SparklesIcon } from "lucide-react";
import { useId } from "react";
import CrueltyFreeIcon from "~/assets/cruelty-free.svg?react";
import footerLogo from "~/assets/footer-logo.svg";
import { Logo } from "~/components/Logo";

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
	return (
		<header className="bg-surface px-8 py-4 text-on-surface">
			<div className="relative flex items-center justify-between">
				<Link to="/">
					<Logo scale={0.75} />
				</Link>
				<div className="absolute left-1/2 -translate-x-1/2">
					<SearchForm />
				</div>
				<div className="flex items-center gap-4">
					<Link
						to="/explore"
						className="flex h-10 items-center justify-center gap-2 rounded-lg bg-on-surface px-3 text-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-on-surface"
					>
						<span className="text-sm font-medium">Explore</span>
						<SparklesIcon className="fill-amber-500 text-amber-600" />
					</Link>
				</div>
			</div>
			<nav className="pt-6">
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
					<li>
						<NavLink to="/library">Library</NavLink>
					</li>
				</ul>
			</nav>
		</header>
	);
}

function SearchForm() {
	return (
		<Form role="search" className="relative">
			<input
				name="query"
				placeholder="Search"
				required
				className="h-9 w-80 rounded bg-on-surface pl-3 pr-9 text-surface placeholder:text-surface/60 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-on-surface"
			/>
			<SearchIcon className="pointer-events-none absolute right-2 top-1/2 size-5 -translate-y-1/2 text-surface" />
		</Form>
	);
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
	return (
		<Link
			to={to}
			className="
				relative select-none
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
