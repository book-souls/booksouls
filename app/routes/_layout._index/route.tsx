import { useLoaderData } from "@remix-run/react";
import { useId } from "react";
import ReactPlayer from "react-player";
import Read from "~/assets/read.svg?react";
import Recomendation from "~/assets/recomendation.webm";
import Search from "~/assets/search.webm";
import Summarization from "~/assets/summarization.webm";
import { BookCard } from "~/components/BookCard";
import ConsoleText from "~/components/ConsoleText";
import { loader, type FeaturedBook } from "./loader.server";

export { loader };

export default function Page() {
	const { featuredBooks } = useLoaderData<typeof loader>();
	return (
		<main>
			<Section1 />
			<div className="line-gradient" />
			<Section2
				video={Summarization}
				text="Summarize your books in seconds with our AI powered summarization tool"
			/>
			<Section2
				video={Recomendation}
				reverse={true}
				text="Get Books similar to any book you like with our AI powered recommendation tool"
			/>
			<Section2
				video={Search}
				text="Search for any book you like By Title, Author, or Description with our AI powered search tool"
			/>
			<div className="mt-16" />
			<FeaturedBooksSection books={featuredBooks}/>
			<div className="line-gradient" />
		</main>
	);
}

function Section1() {
	return (
		<section className="flex max-h-[calc(100vh-var(--header-h))] min-h-[400px] flex-row items-center bg-surface  text-on-surface">
			<div className="flex w-[50%] justify-center items-center px-20">
				<ConsoleText
					words={["Your Reading Companion \n Summarized Texts \n & Thoughtful Book Choicess"]}
					id="text"
					colors={["#d2ecf9"]}
					className="text-4xl font-medium "
				/>
			</div>
			<div className="mb-4 flex w-[50%] justify-center"></div>
		</section>
	);
}
function Section2({ text, video, reverse }: { text: string; video: string ; reverse?: boolean}) {
	return (
		<section className="  m-auto  mt-16 flex  w-[90%] flex-row  rounded-xl  justify-between text-on-surface data-[reverse='true']:flex-row-reverse " data-reverse = {reverse}>
			
				<div className="flex w-[30%] justify-center items-center  text-2xl   bg-surface p-10 mx-2 rounded-xl">
					<div >{text}</div>
				</div>
				<div className=" flex w-[70%] justify-center overflow-hidden rounded-xl border border-gray-400 ">
					<video autoPlay loop muted playsInline className="w-full">
						<source src={video} type="video/mp4" />
					</video>
				</div>
			
		</section>
	);
}
function FeaturedBooksSection({ books }: { books: FeaturedBook[] }) {
	const headerId = useId();
	return (
		<section aria-labelledby={headerId} className="py-12">
			<h2 id={headerId} className="mb-8 text-center text-4xl font-medium uppercase">
				Featured Books
			</h2>
			<ul role="list" className="mx-auto grid w-fit grid-cols-4 gap-8">
				{books.map((book) => (
					<li key={book.id}>
						<BookCard book={book} />
					</li>
				))}
			</ul>
		</section>
	);
}
