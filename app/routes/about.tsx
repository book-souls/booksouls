import { Link } from "@remix-run/react";
import AboutIcon from "~/assets/about.svg?react";
import placeholder from "~/assets/placeholder.jpeg";
import { Logo } from "~/components/Logo";

export default function About() {
	return (
		<main>
			<div className="bg-brand-light absolute left-[80px] top-[50px] z-10 flex h-[620px] w-[1130px] flex-col items-center">
				<h1 className="text-brand-lightest py-5 text-4xl">About Book Souls</h1>
			</div>
			<div className="bg-brand absolute right-[80px] top-0 h-full w-[500px]">
				<Link to="/">
					<Logo className="absolute right-6 top-0 z-20 w-40" />
				</Link>
				<div className="absolute left-64 top-20 z-30 p-7">
					<h1 className="text-brand-lightest mb-5 text-xl">Meet The Creators</h1>
					<div className="right-0 grid h-full grid-cols-2 justify-center gap-7">
						<Creator href="#" image={placeholder}></Creator>
						<Creator href="#" image={placeholder}></Creator>
						<Creator href="#" image={placeholder}></Creator>
						<Creator href="#" image={placeholder}></Creator>
						<Creator href="#" image={placeholder}></Creator>
						<Creator href="#" image={placeholder}></Creator>
					</div>
				</div>
				<AboutIcon className="absolute bottom-0 right-0 z-20 h-auto w-80"></AboutIcon>
			</div>
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
