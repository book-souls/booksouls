import { Link } from "@remix-run/react";
import { LinkedinIcon } from "lucide-react";
import { useState } from "react";
// Team Images
import Ahmed from "~/assets/Ahmed.png";
import SearchIcon from "~/assets/Ai-search.svg";
import Bahaa from "~/assets/Bahaa.jpg";
import BookStackIcon from "~/assets/bookstack-old.svg";
import CheckerIcon from "~/assets/checker.svg";
import Deena from "~/assets/Deena.png";
import Essmat from "~/assets/Essmat.jpg";
import SummaryIcon from "~/assets/fast-summerization.svg";
import FasterIcon from "~/assets/faster.svg";
import UiIcon from "~/assets/minimalist-ui.svg";
import MobileIcon from "~/assets/mobile.svg";
import MultiLangIcon from "~/assets/multi-lang.svg";
import Nour from "~/assets/Nour.jpg";
// Icons
import TeamIcon from "~/assets/team.svg?react";
import Zeyad from "~/assets/Zeyad.jpg";

export default function About() {
	return (
		<main>
			<section className="flex items-center gap-24 bg-surface px-20 py-10 text-on-surface">
				<div className="flex flex-col items-center gap-10">
					<h1 className="text-center text-4xl font-light tracking-widest">ABOUT US</h1>
					<p className="text-lg font-light leading-loose">
						Welcome to <span className="font-medium">Book Souls</span> — the digital crossroads
						where innovative technology meets the love of books. This platform is not only our
						virtual bookshelf but also a capstone of our academic journey, a graduation project
						designed with readers in mind.
					</p>
					<Link to="#vision" className="">
						<button className="w-[150px] rounded-2xl bg-gradient-to-l from-primary to-primary-light p-4 py-3 text-lg font-normal tracking-wider text-on-primary shadow-inner">
							Learn More
						</button>
					</Link>
				</div>
				<div>
					<TeamIcon
						aria-label="Four people Working on a Project"
						className="h-[500px] w-[500px]"
						role="img"
					/>
				</div>
			</section>
			<div className="line-gradient" />

			<section id="vision" className="flex flex-col items-center px-20 pb-16 pt-10 text-primary">
				<h1 className="text-lg uppercase">Our Vision</h1>
				<p className="pt-5 text-4xl font-bold text-surface">Easy, Simple, and Delightful!</p>

				<div className="flex flex-row gap-28 py-24 text-lg">
					<About_icons image={BookStackIcon} data={"Variety of Books"} />
					<About_icons image={SummaryIcon} data={"Fast Summarization"} />
					<About_icons image={SearchIcon} data={"AI Powered Search"} />
					<About_icons image={UiIcon} data={"Minimalist UI"} />
				</div>
				<p className="text-center text-xl">
					<span className="font-bold">Book Souls</span> aims to make a difference in readers’
					journeys <br />
					through embedding of AI in our platform making reading
					<br />
					less stressing and more fun!
				</p>
			</section>

			<section className="flex flex-col items-center bg-surface bg-opacity-10 px-20 pb-16 pt-10 text-primary">
				<h1 className="text-lg uppercase">Future Work</h1>
				<p className="pt-5 text-4xl font-bold text-surface">Shaping the Future: Ongoing Work</p>
				{/*Upcoming Features: A sneak peek into future updates*/}
				<div className="flex flex-row gap-28 py-24 text-lg">
					<About_icons image={MobileIcon} data={"Mobile App"} />
					<About_icons image={FasterIcon} data={"Faster Response"} />
					<About_icons image={CheckerIcon} data={"Pronunciation Checker"} />
					<About_icons image={MultiLangIcon} data={"Multi-Language Support"} />
				</div>
				<p className="text-center text-xl">
					<span className="font-bold">Book Souls</span> Lorem ipsum dolor sit amet consectetur,
					adipisicing elit.
					<br />
					Eaque unde accusamus voluptatibus fuga, explicabo blanditiis, placeat doloribus,
					<br />
					cupiditate beatae possimus amet praesentium sunt quia?
					{/* TODO: IDK What to wrtie ;-; */}
				</p>
			</section>

			<section className="flex flex-col items-center px-20 pb-16 pt-10 ">
				<h1 className="text-lg uppercase">The Team</h1>
				<p className="pt-5 text-4xl font-bold text-surface">Meet The Creators</p>

				<div className="grid grid-cols-3 grid-rows-2 gap-x-20 gap-y-12 pt-14">
					<Creator href="https://linkedin.com/in/deena-fathi/" image={Deena} name={"Deena Fathi"} />
					<Creator
						href="https://linkedin.com/in/abdelrahman-bahaa/"
						image={Bahaa}
						name={"Abdelrahman Bahaa"}
					/>
					<Creator
						href="https://linkedin.com/in/ahmed-saied02/"
						image={Ahmed}
						name={"Ahmed Mohamed"}
					/>
					<Creator href="#" image={Nour} name={"Nour Yasser"} />
					<Creator
						href="https://linkedin.com/in/abdelrahman-essmat-b525761b2/"
						image={Essmat}
						name={"Abdelrahman Essmat"}
					/>
					<Creator
						href="https://linkedin.com/in/zeyad-bassiouny-653907246/"
						image={Zeyad}
						name={"Zeyad Mahmoud"}
					/>
				</div>
			</section>
		</main>
	);
}

function Creator({ href, image, name }: { href: string; image: string; name: string }) {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<div
			className="relative flex flex-col items-center"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<Link to={href}>
				<div className="relative">
					<img
						src={image}
						alt={name}
						className={`h-[150px] w-[150px] rounded-full shadow-lg ${isHovered ? "bg-blend-darken" : "bg-blend-normal"}`}
					/>
					<div
						className={`absolute inset-0 rounded-full bg-gradient-to-t from-stone-800/50 via-stone-800/10 to-transparent transition-opacity duration-500 ease-in-out ${isHovered ? "opacity-100" : "opacity-0"}`}
					/>
					<LinkedinIcon
						aria-label="LinkedIn Icon"
						className={`absolute bottom-0 left-0 right-0 m-auto rounded-md fill-white p-0.5 text-white drop-shadow-2xl transition-opacity duration-500 ease-in-out ${isHovered ? "opacity-100" : "opacity-0"}`}
						role="img"
					/>
				</div>
			</Link>

			<p className="pt-4 text-center text-xl font-medium">{name}</p>
		</div>
	);
}

function About_icons({ image, data }: { image: string; data: string }) {
	return (
		<div className="flex flex-col items-center gap-5">
			<img src={image} alt={data} className="h-[100px] w-[100px]" />
			<p>{data}</p>
		</div>
	);
}
