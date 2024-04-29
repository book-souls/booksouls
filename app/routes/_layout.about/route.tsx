import { Link } from "@remix-run/react";
import { LinkedinIcon } from "lucide-react";
import { useId } from "react";
import ahmed from "~/assets/Ahmed.png";
import SearchIcon from "~/assets/Ai-search.svg?react";
import bahaa from "~/assets/Bahaa.jpg";
import BookStackIcon from "~/assets/bookstack-old.svg?react";
import CheckerIcon from "~/assets/checker.svg?react";
import deena from "~/assets/Deena.png";
import essmat from "~/assets/Essmat.jpg";
import SummaryIcon from "~/assets/fast-summerization.svg?react";
import FasterIcon from "~/assets/faster.svg?react";
import UiIcon from "~/assets/minimalist-ui.svg?react";
import MobileIcon from "~/assets/mobile.svg?react";
import MultiLangIcon from "~/assets/multi-lang.svg?react";
import nour from "~/assets/Nour.jpg";
import TeamIcon from "~/assets/team.svg?react";
import zeyad from "~/assets/Zeyad.jpg";

export default function About() {
	const visionSectionId = useId();
	return (
		<main>
			<AboutUsSection visionSectionId={visionSectionId} />
			<div className="line-gradient" />
			<VisionSection id={visionSectionId} />
			<FutureWorkSection />
			<TeamSection />
		</main>
	);
}

function AboutUsSection({ visionSectionId }: { visionSectionId: string }) {
	const headerId = useId();
	return (
		<section
			aria-labelledby={headerId}
			className="flex items-center gap-24 bg-surface px-20 py-10 text-on-surface"
		>
			<div className="flex flex-col items-center gap-10">
				<h1 id={headerId} className="text-center text-4xl font-light uppercase tracking-widest">
					About Us
				</h1>
				<p className="text-lg font-light leading-loose">
					Welcome to <span className="font-medium">Book Souls</span> — the digital crossroads where
					innovative technology meets the love of books. This platform is not only our virtual
					bookshelf but also a capstone of our academic journey, a graduation project designed with
					readers in mind.
				</p>
				<Link
					to={`#${visionSectionId}`}
					className="w-[150px] rounded-xl bg-gradient-to-l from-primary to-primary-light p-4 py-3 text-center text-lg tracking-wider text-on-primary shadow-inner"
				>
					Learn More
				</Link>
			</div>
			<div>
				<TeamIcon
					role="img"
					aria-label="Four people working on a project"
					className="h-[500px] w-[500px]"
				/>
			</div>
		</section>
	);
}

function VisionSection({ id }: { id: string }) {
	const headerId = useId();
	return (
		<section
			id={id}
			aria-labelledby={headerId}
			className="flex flex-col items-center px-20 pb-16 pt-10 text-primary"
		>
			<h2 id={headerId} className="text-lg uppercase">
				Our Vision
			</h2>
			<p className="pt-5 text-4xl font-bold text-surface">Easy, Simple, and Delightful!</p>
			<div className="flex flex-row gap-28 py-24 text-lg">
				<LabeledIcon Icon={BookStackIcon} label="Variety of Books" />
				<LabeledIcon Icon={SummaryIcon} label="Fast Summarization" />
				<LabeledIcon Icon={SearchIcon} label="AI Powered Search" />
				<LabeledIcon Icon={UiIcon} label="Minimalist UI" />
			</div>
			<p className="text-center text-xl">
				<span className="font-bold">Book Souls</span> aims to make a difference in readers’ journeys
				<br />
				through embedding of AI in our platform making reading
				<br />
				less stressing and more fun!
			</p>
		</section>
	);
}

function FutureWorkSection() {
	const headerId = useId();
	return (
		<section
			aria-labelledby={headerId}
			className="flex flex-col items-center bg-surface bg-opacity-10 px-20 pb-16 pt-10 text-primary"
		>
			<h2 id={headerId} className="text-lg uppercase">
				Future Work
			</h2>
			<p className="pt-5 text-4xl font-bold text-surface">Shaping the Future: Ongoing Work</p>
			{/* Upcoming Features: A sneak peek into future updates */}
			<div className="flex flex-row gap-28 py-24 text-lg">
				<LabeledIcon Icon={MobileIcon} label="Mobile App" />
				<LabeledIcon Icon={FasterIcon} label="Faster Response" />
				<LabeledIcon Icon={CheckerIcon} label="Pronounciation Checker" />
				<LabeledIcon Icon={MultiLangIcon} label="Multi-Language Support" />
			</div>
			<p className="text-center text-xl">
				<span className="font-bold">Book Souls</span> Lorem ipsum dolor sit amet consectetur,
				adipisicing elit.
				<br />
				Eaque unde accusamus voluptatibus fuga, explicabo blanditiis, placeat doloribus,
				<br />
				cupiditate beatae possimus amet praesentium sunt quia?
				{/* TODO: IDK What to write ;-; */}
			</p>
		</section>
	);
}

function TeamSection() {
	const headerId = useId();
	return (
		<section aria-labelledby={headerId} className="flex flex-col items-center px-20 pb-16 pt-10">
			<h2 id={headerId} className="text-lg uppercase">
				The Team
			</h2>
			<p className="pt-5 text-4xl font-bold text-surface">Meet The Creators</p>
			<div className="grid grid-cols-3 gap-x-20 gap-y-12 pt-14">
				<Creator linkedin="https://linkedin.com/in/deena-fathi/" image={deena} name="Deena Fathi" />
				<Creator
					linkedin="https://linkedin.com/in/abdelrahman-bahaa/"
					image={bahaa}
					name="Abdelrahman Bahaa"
				/>
				<Creator
					linkedin="https://linkedin.com/in/ahmed-saied02/"
					image={ahmed}
					name="Ahmed Mohamed"
				/>
				<Creator linkedin="#" image={nour} name="Nour Yasser" />
				<Creator
					linkedin="https://linkedin.com/in/abdelrahman-essmat-b525761b2/"
					image={essmat}
					name="Abdelrahman Essmat"
				/>
				<Creator
					linkedin="https://linkedin.com/in/zeyad-bassiouny-653907246/"
					image={zeyad}
					name="Zeyad Mahmoud"
				/>
			</div>
		</section>
	);
}

function Creator({ linkedin, image, name }: { linkedin: string; image: string; name: string }) {
	return (
		<div className="group flex flex-col items-center">
			<Link to={linkedin} target="_blank" rel="noreferrer noopener" className="relative">
				<img
					src={image}
					alt={name}
					className="h-[150px] w-[150px] rounded-full bg-blend-normal shadow-lg group-hover:bg-blend-darken"
				/>
				<div className="absolute inset-0 rounded-full bg-gradient-to-t from-stone-800/50 via-stone-800/10 to-transparent opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100" />
				<LinkedinIcon
					role="img"
					aria-label="LinkedIn"
					className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-md fill-white p-0.5 text-white opacity-0 drop-shadow-2xl transition-opacity duration-500 ease-in-out group-hover:opacity-100"
				/>
			</Link>
			<Link
				to={linkedin}
				target="_blank"
				rel="noreferrer noopener"
				className="mt-4 text-center text-xl font-medium hover:underline"
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
	return (
		<div className="flex flex-col items-center gap-5">
			<Icon aria-hidden className="h-[100px] w-[100px]" />
			<p className="text-center">{label}</p>
		</div>
	);
}