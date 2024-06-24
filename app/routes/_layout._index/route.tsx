import { useLoaderData } from "@remix-run/react";
import { useId } from "react";
import bot from "~/assets/Home Page Bot.svg";
import search from "~/assets/search.mp4";
import similarBooks from "~/assets/similar-books.mp4";
import summarization from "~/assets/summarization.mp4";
import { BookCard } from "~/components/BookCard";
import ConsoleText from "~/components/ConsoleText";
import { loader, type FeaturedBook } from "./loader.server";

export { loader };

export default function Page() {
	const { featuredBooks } = useLoaderData<typeof loader>();
	return (
		<main>
			<LandingSection />
			<div className="line-gradient" />
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
	return (
		<section className="flex max-h-[calc(100vh-var(--header-h))] min-h-[400px] flex-row items-center bg-surface text-on-surface">
			<div className="flex w-[50%] items-center justify-center px-20">
				<ConsoleText
					words={["Your Reading Companion \n Summarized Texts \n & Thoughtful Book Choicess"]}
					id="text"
					colors={["#d2ecf9"]}
					className="text-4xl font-medium"
				/>
			</div>
			<div className="mb-4 flex w-[50%] justify-center">
				<img src={bot} alt="Bot Next to Computer" className="max-w-[330px]" />
			</div>
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
	const headerId = useId();
	return (
		<section aria-labelledby={headerId} className="mx-auto w-fit pt-32">
			<div
				data-reverse={reverse}
				className="flex flex-row items-center gap-12 rounded-xl bg-surface p-10 text-on-surface data-[reverse='true']:flex-row-reverse"
			>
				<div className="w-80">
					<h2 id={headerId} className="text-3xl">
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
	const headerId = useId();
	return (
		<section aria-labelledby={headerId} className="pb-12 pt-32">
			<h2 id={headerId} className="mb-8 text-center text-4xl font-medium uppercase">
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
