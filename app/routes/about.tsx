import { Link } from "@remix-run/react";
import AboutIcon from "~/assets/about.svg?react";
import placeholder from "~/assets/placeholder.jpeg";
import { Logo } from "~/components/Logo";

export default function About() {
	return (
		<main className="relative h-screen">
			<div className="absolute bottom-12 left-12 top-12 z-10 w-4/6 bg-primary text-on-primary">
				<h1 className="py-5 text-center text-4xl">About Book Souls</h1>
			</div>
			<div className="absolute right-12 h-full w-1/3 bg-surface px-6 py-3 text-on-surface">
				<Link to="/">
					<Logo scale={0.5} className="ml-auto" />
				</Link>
				<h2 className="mt-8 text-right text-xl font-light">Meet the Creators</h2>
				<div className="ml-auto mt-6 grid w-fit grid-cols-2 gap-6">
					<Creator href="#" image={placeholder} />
					<Creator href="#" image={placeholder} />
					<Creator href="#" image={placeholder} />
					<Creator href="#" image={placeholder} />
				</div>
			</div>
			<AboutIcon
				aria-label="Three people standing next to each other"
				className="absolute bottom-0 right-12 z-20 h-[auto] w-80"
			/>
		</main>
	);
}

function Creator({ href, image }: { href: string; image: string }) {
	// TODO: add better alt text
	return (
		<Link to={href}>
			<img src={image} alt="creator" className="h-[80px] w-[80px] rounded-full" />
		</Link>
	);
}
