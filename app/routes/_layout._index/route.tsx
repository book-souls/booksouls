import { useLoaderData } from "@remix-run/react";
import { useId } from "react";
import BotIcon from "~/assets/home-page-bot.svg?react";
import search from "~/assets/search.mp4";
import similarBooks from "~/assets/similar-books.mp4";
import summarization from "~/assets/summarization.mp4";
import { BookCard } from "~/components/BookCard";
import { Typewriter } from "~/components/Typewriter";
import { loader, type FeaturedBook } from "./loader.server";

export { loader };

export default function Page() {
	const { featuredBooks } = useLoaderData<typeof loader>();
	return (
		<main>
			<LandingSection />
			<FeatureSection
				title="Smart Suggestions"
				description="Smart suggestions based on the content of the book to enhance the user experience"
				video={similarBooks}
			/>
			<FeatureSection
				title="Narrate your story"
				description="Discover new books with our easy to use AI-powered search engine"
				video={search}
				reverse
			/>
			<FeatureSection
				title="Book Summarization"
				description="Summarize books in seconds with our AI-powered summarization tool"
				video={summarization}
			/>
			<FeaturedBooksSection books={featuredBooks} />
		</main>
	);
}

function LandingSection() {
	const id = useId();
	const headingId = `${id}:heading`;
	const descriptionId = `${id}:description`;
	const title = "Your Reading Companion";
	const description = "Summarized Texts & Thoughtful Book Choices";
	const animationFrequency = 40;
	const animationDelay = 250;
	return (
		<section
			aria-labelledby={headingId}
			aria-describedby={descriptionId}
			className="flex h-[calc(100vh-var(--header-h))] max-h-[800px] min-h-[400px] flex-col bg-surface text-on-surface"
		>
			<div className="flex flex-grow flex-row items-center justify-center gap-20">
				<div className="w-[600px]">
					<Typewriter
						tag="h1"
						id={headingId}
						duration={title.length * animationFrequency}
						className="text-4xl font-medium"
					>
						{title}
					</Typewriter>
					<Typewriter
						tag="p"
						id={descriptionId}
						duration={description.length * animationFrequency}
						delay={title.length * animationFrequency + animationDelay}
						className="mt-8 min-h-8 text-2xl"
					>
						{description}
					</Typewriter>
				</div>
				<BotIcon role="img" aria-label="A bot next to a laptop" className="h-[auto] w-[250px]" />
			</div>
			<div className="line-gradient shrink-0" />
		</section>
	);
}

function FeatureSection({
	title,
	description,
	video,
	reverse,
}: {
	title: string;
	description: string;
	video: string;
	reverse?: boolean;
}) {
	const headingId = useId();
	return (
		<section aria-labelledby={headingId} className="mx-auto w-fit pt-32">
			<div
				data-reverse={reverse}
				className="flex flex-row items-center gap-12 rounded-xl bg-surface p-10 text-on-surface data-[reverse='true']:flex-row-reverse"
			>
				<div className="w-80">
					<h2 id={headingId} className="text-3xl font-medium">
						{title}
					</h2>
					<p className="mt-8 text-justify text-lg">{description}</p>
				</div>
				<video
					autoPlay
					loop
					muted
					playsInline
					className="aspect-[3/2] w-[480px] rounded-xl xl:w-[640px]"
				>
					<source src={video} type="video/mp4" />
				</video>
			</div>
		</section>
	);
}

function FeaturedBooksSection({ books }: { books: FeaturedBook[] }) {
	const headingId = useId();
	return (
		<section aria-labelledby={headingId} className="pb-12 pt-32">
			<h2 id={headingId} className="mb-8 text-center text-4xl font-medium uppercase">
				Featured Books
			</h2>
			<ul role="list" className="mx-auto grid w-fit grid-cols-4 gap-8 xl:grid-cols-5">
				{books.map((book) => (
					<li key={book.id}>
						<BookCard book={book} />
					</li>
				))}
			</ul>
		</section>
	);
}
