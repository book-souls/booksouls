import { Link, Outlet } from "@remix-run/react";
import { SearchIcon } from "lucide-react";
import React from "react";
import CrueltyFreeIcon from "~/assets/cruelty-free.svg?react";
import footerLogo from "~/assets/footer-logo.svg";
import { IconButton } from "~/components/IconButton";
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
		<header className="flex h-[150px] flex-col items-center justify-center bg-primary text-primary-foreground">
			<Logo />
			<div className="relative mt-4 w-full">
				<nav className="flex flex-row items-center justify-center gap-16">
					<NavLink to="/">Home</NavLink>
					<NavLink to="/categories">Categories</NavLink>
					<NavLink to="/authors">Authors</NavLink>
					<NavLink to="/library">Library</NavLink>
				</nav>
				<IconButton className="absolute right-6 top-1/2 -translate-y-1/2">
					<SearchIcon />
				</IconButton>
			</div>
		</header>
	);
}

function NavLink({
	to,
	children,
	className = "",
}: {
	to: string;
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<Link
			to={to}
			className={`
				relative select-none
				before:absolute before:-bottom-0.5 before:right-1/2 before:h-px before:w-1/2 before:origin-right before:scale-x-0 before:bg-primary-foreground before:transition-transform before:duration-500
				after:absolute after:-bottom-0.5 after:left-1/2 after:h-px after:w-1/2 after:origin-left after:scale-x-0 after:bg-primary-foreground after:transition-transform after:duration-500
				hover:before:scale-x-100 hover:after:scale-x-100
				focus:outline focus:outline-current focus:before:hidden focus:after:hidden
				${className}
			`}
		>
			{children}
		</Link>
	);
}

function Footer() {
	return (
		<footer className="relative bg-primary p-5 text-primary-foreground">
			<div className="flex justify-between">
				<div className="w-[200px]">
					<img
						src={footerLogo}
						alt="Book Souls logo"
						width={158.25}
						height={148.5}
						className="mx-auto"
					/>
					<p className="text-center text-sm font-light">
						Get Engulphed and Explore a New Magical World
					</p>
				</div>
				<FooterLinks />
				<EmailContactForm />
			</div>
			<p className="mt-12 font-light">Copyright © 2024 Book Souls Inc. All rights reserved.</p>
			<CrueltyFreeIcon className="absolute bottom-5 right-5" />
		</footer>
	);
}

function FooterLinks() {
	return (
		<div className="mt-6 flex justify-center gap-20">
			<section>
				<h3 className="text-lg font-medium uppercase">About</h3>
				<nav className="flex flex-col gap-2 pt-4">
					<FooterNavLink to="/about">About Us</FooterNavLink>
					<FooterNavLink to="/terms-and-privacy">Terms & Privacy</FooterNavLink>
				</nav>
			</section>
			<section>
				<h3 className="text-lg font-medium uppercase">Customer Care</h3>
				<nav className="flex flex-col gap-2 pt-4">
					<FooterNavLink to="/contact-us">Contact Us</FooterNavLink>
					<FooterNavLink to="/faq">Frequently Asked Questions</FooterNavLink>
				</nav>
			</section>
		</div>
	);
}

function FooterNavLink({ to, children }: { to: string; children: React.ReactNode }) {
	return (
		<NavLink to={to} className="w-fit font-light">
			{children}
		</NavLink>
	);
}

function EmailContactForm() {
	const id = React.useId();
	return (
		<form className="mt-6" onSubmit={(e) => e.preventDefault()}>
			<label htmlFor={id} className="uppercase">
				Stay in touch
			</label>
			<div
				className="
					mt-1 flex border border-primary-foreground
					focus-within:outline focus-within:outline-1 focus-within:outline-offset-2 focus-within:outline-current
				"
			>
				<input
					id={id}
					type="email"
					placeholder="Email..."
					className="h-10 bg-transparent px-2 py-1 placeholder:text-primary-foreground/50 focus:outline-none"
				/>
				<button className="bg-primary-foreground px-1.5 font-medium uppercase text-primary">
					Go
				</button>
			</div>
		</form>
	);
}
