import { Link } from "@remix-run/react";
import { LinkedinIcon } from "lucide-react";
import React, { useId } from "react";
import ahmed from "~/assets/Ahmed.webp";
import SearchIcon from "~/assets/Ai-search.svg?react";
import bahaa from "~/assets/Bahaa.webp";
import BookStackIcon from "~/assets/bookstack.svg?react";
import CheckerIcon from "~/assets/checker.svg?react";
import deena from "~/assets/Deena.webp";
import essmat from "~/assets/Essmat.webp";
import SummaryIcon from "~/assets/fast-summerization.svg?react";
import FasterIcon from "~/assets/faster.svg?react";
import UiIcon from "~/assets/minimalist-ui.svg?react";
import MobileIcon from "~/assets/mobile.svg?react";
import MultiLangIcon from "~/assets/multi-lang.svg?react";
import nour from "~/assets/Nour.webp";
import TeamIcon from "~/assets/team.svg?react";
import zeyad from "~/assets/Zeyad.webp";
import { prefersReducedMotion } from "~/utils/media-query";

export default function Page() {
	return (
		<main>
			<AboutUsSection />
			<VisionSection />
			<FutureWorkSection />
			<TeamSection />
		</main>
	);
}

function AboutUsSection() {
	const headingId = useId();

	function navigateToVisionSection(event: React.MouseEvent) {
		const vision = document.getElementById("vision");
		if (vision !== null) {
			event.preventDefault();
			vision.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
		}
	}

	return (
		<section
			aria-labelledby={headingId}
			className="flex h-[calc(100vh-var(--header-h))] max-h-[800px] min-h-[500px] flex-col bg-surface text-on-surface"
		>
			<div className="flex flex-grow items-center justify-center gap-24 px-20">
				<div className="flex flex-col items-center gap-10">
					<h1 id={headingId} className="text-center text-4xl font-light uppercase tracking-widest">
						About Us
					</h1>
					<p className="max-w-2xl text-lg font-light leading-loose">
						Welcome to <strong className="font-medium">Book Souls</strong> — the digital crossroads
						where innovative technology meets the love of books. This platform is not only our
						virtual bookshelf but also a capstone of our academic journey, a graduation project
						designed with readers in mind.
					</p>
					<Link
						to="#vision"
						className="button focus-visible:outline-primary-light"
						onClick={navigateToVisionSection}
					>
						Learn More
					</Link>
				</div>
				<TeamIcon
					role="img"
					aria-label="Four people working on a project"
					className="h-auto w-[350px] shrink-0"
				/>
			</div>
			<div className="line-gradient" />
		</section>
	);
}

function VisionSection() {
	const headingId = useId();
	return (
		<section
			id="vision"
			aria-labelledby={headingId}
			className="flex flex-col items-center px-20 pb-16 pt-10 text-primary"
		>
			<h2 id={headingId} className="text-lg uppercase">
				Our Vision
			</h2>
			<p className="pt-5 text-4xl font-medium text-surface">Easy, Simple, and Delightful!</p>
			<div className="flex flex-row gap-28 py-24 text-lg">
				<LabeledIcon Icon={BookStackIcon} label="Variety of Books" />
				<LabeledIcon Icon={SummaryIcon} label="Fast Summarization" />
				<LabeledIcon Icon={SearchIcon} label="AI Powered Search" />
				<LabeledIcon Icon={UiIcon} label="Minimalist UI" />
			</div>
			<p className="text-center text-xl">
				<strong className="font-medium">Book Souls</strong> aims to make a difference in readers
				{"' "}
				journeys
				<br />
				through embedding of AI in our platform making reading
				<br />
				less stressing and more fun!
			</p>
		</section>
	);
}

function FutureWorkSection() {
	const headingId = useId();
	return (
		<section
			aria-labelledby={headingId}
			className="flex flex-col items-center bg-surface bg-opacity-10 px-20 pb-16 pt-10 text-primary"
		>
			<h2 id={headingId} className="text-lg uppercase">
				Future Work
			</h2>
			<p className="pt-5 text-4xl font-medium text-surface">Shaping the Future: Ongoing Work</p>
			<div className="flex flex-row gap-28 pt-24 text-lg">
				<LabeledIcon Icon={MobileIcon} label="Mobile App" />
				<LabeledIcon Icon={FasterIcon} label="Faster Response" />
				<LabeledIcon Icon={CheckerIcon} label="Pronounciation Checker" />
				<LabeledIcon Icon={MultiLangIcon} label="Multi-Language Support" />
			</div>
		</section>
	);
}

function TeamSection() {
	const headingId = useId();
	return (
		<section aria-labelledby={headingId} className="flex flex-col items-center px-20 pb-16 pt-10">
			<h2 id={headingId} className="text-lg uppercase">
				The Team
			</h2>
			<p className="pt-5 text-4xl font-medium text-surface">Meet The Creators</p>
			<div className="grid grid-cols-3 gap-x-20 gap-y-12 pt-14">
				<Creator linkedin="https://linkedin.com/in/deena-fathi/" image={deena} name="Deena Fathi" />
				<Creator
					linkedin="https://linkedin.com/in/ahmed-saied02/"
					image={ahmed}
					name="Ahmed Mohamed"
				/>
				<Creator linkedin="https://linkedin.com/in/nour-yasser-/" image={nour} name="Nour Yasser" />
				<Creator
					linkedin="https://linkedin.com/in/zeyad-bassiouny-653907246/"
					image={zeyad}
					name="Zeyad Mahmoud"
				/>
				<Creator
					linkedin="https://linkedin.com/in/abdelrahman-essmat-b525761b2/"
					image={essmat}
					name="Abdelrahman Essmat"
				/>
				<Creator
					linkedin="https://linkedin.com/in/abdelrahman-bahaa/"
					image={bahaa}
					name="Abdelrahman Bahaa"
				/>
			</div>
		</section>
	);
}

function Creator({ linkedin, image, name }: { linkedin: string; image: string; name: string }) {
	return (
		<div className="flex flex-col items-center">
			<Link
				to={linkedin}
				target="_blank"
				rel="noreferrer noopener"
				tabIndex={-1}
				className="group relative"
			>
				<img
					src={image}
					alt={name}
					className="h-[150px] w-[150px] rounded-full border border-slate-400 bg-blend-normal group-hover:bg-blend-darken"
				/>
				<div className="absolute inset-0 rounded-full bg-gradient-to-t from-stone-800/50 via-stone-800/10 to-transparent opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100" />
				<LinkedinIcon className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-md fill-white p-0.5 text-white opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100" />
			</Link>
			<Link
				to={linkedin}
				target="_blank"
				rel="noreferrer noopener"
				className="mt-4 text-center text-xl font-medium hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
			>
				{name}
			</Link>
		</div>
	);
}

function LabeledIcon({
	Icon,
	label,
}: {
	Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
	label: string;
}) {
	const labelId = useId();
	return (
		<div className="flex flex-col items-center gap-5">
			<Icon className="h-[100px] w-[100px]" />
			<p id={labelId} className="text-center">
				{label}
			</p>
		</div>
	);
}
