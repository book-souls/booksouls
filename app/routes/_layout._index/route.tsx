import { useLoaderData } from "@remix-run/react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import React from "react";
import { useSnapCarousel } from "react-snap-carousel";
import placeholder from "~/assets/placeholder.jpeg";
import Read from "~/assets/read.svg?react";
import { IconButton } from "~/components/IconButton";
import { loader, type Book } from "./loader.server";

export { loader };

export default function Page() {
	const { books, featuredBooks } = useLoaderData<typeof loader>();
	return (
		<main>
			<section className="flex max-h-[calc(100vh-var(--header-h))] min-h-[400px] flex-col items-center bg-surface pt-8 text-on-surface">
				<h1 className="mb-16 text-center text-6xl font-thin uppercase">Get Engulfed</h1>
				<Read role="img" aria-label="A person sitting on a chair reading a book" />
				<div className="line-gradient" />
			</section>
			<FeaturedBooksSection books={featuredBooks} />
			<FeaturedBooksCarousel books={featuredBooks} />
			<div className="space-y-8 py-12">
				{books.map(([genre, genreBooks]) => (
					<GenreSection key={genre} genre={genre} books={genreBooks} />
				))}
			</div>
		</main>
	);
}

function FeaturedBooksSection({ books }: { books: Book[] }) {
	const headerId = React.useId();
	return (
		<section aria-labelledby={headerId} className="py-12">
			<h2 id={headerId} className="mb-8 text-center text-5xl font-medium uppercase">
				Featured Books
			</h2>
			<div className="mx-auto grid w-fit grid-cols-4 gap-8">
				{books.map((book) => (
					<div key={book.id}>
						<img
							src={placeholder}
							alt=""
							className="h-[300px] w-[200px] rounded-lg object-cover shadow-md"
						/>
						<p className="mt-2 w-[200px] text-center text-lg">{book.title}</p>
					</div>
				))}
			</div>
		</section>
	);
}

function FeaturedBooksCarousel({ books }: { books: Book[] }) {
	const { scrollRef, activePageIndex, prev, next } = useSnapCarousel();
	const scrollId = React.useId();
	return (
		<section
			aria-roledescription="carousel"
			aria-label="Featured books"
			className="bg-gradient-to-r from-primary to-primary-light text-on-primary"
		>
			<div
				ref={scrollRef}
				id={scrollId}
				aria-live="polite"
				className="relative flex snap-x snap-mandatory overflow-x-auto pb-6 pt-8 scrollbar-hidden"
			>
				{books.map((book, index) => (
					<div
						key={book.id}
						role="group"
						aria-roledescription="slide"
						aria-labelledby={`${scrollId}-${index}`}
						aria-hidden={index !== activePageIndex}
						className="flex shrink-0 basis-full snap-center items-center justify-center gap-12"
					>
						<span id={`${scrollId}-${index}`} className="sr-only">
							{`${index + 1} of ${books.length}`}
						</span>
						<img src={placeholder} alt="" className="h-[375px] w-[250px] rounded-xl object-cover" />
						<div className="max-w-lg">
							<h3 className="text-3xl">{book.title}</h3>
							<p className="mt-4">{book.shortDescription}</p>
						</div>
					</div>
				))}
			</div>
			<div className="flex items-center justify-center pb-4">
				<IconButton
					aria-label="Go to the previous slide"
					aria-controls={scrollId}
					aria-disabled={activePageIndex === 0}
					className="aria-disabled:pointer-events-none aria-disabled:opacity-40"
					onClick={() => prev()}
				>
					<ChevronLeftIcon />
				</IconButton>
				<p aria-hidden className="w-32 text-center">
					{activePageIndex + 1} / {books.length}
				</p>
				<IconButton
					aria-label="Go to the next slide"
					aria-controls={scrollId}
					aria-disabled={activePageIndex === books.length - 1}
					className="aria-disabled:pointer-events-none aria-disabled:opacity-40"
					onClick={() => next()}
				>
					<ChevronRightIcon />
				</IconButton>
			</div>
		</section>
	);
}

function GenreSection({ genre, books }: { genre: string; books: Book[] }) {
	return (
		// 896px = 32px * 3 + 200px * 4
		<section className="mx-auto w-[896px]">
			<h3 className="pb-8 text-2xl font-medium">{genre}</h3>
			<section
				// eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
				tabIndex={0}
				aria-label={`${genre} books. ${books.length} slides.`}
				className="flex snap-x snap-mandatory gap-[32px] overflow-x-auto pb-6 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-current"
			>
				{books.map((book, index) => (
					<div key={book.id} aria-label={`Slide ${index + 1}`} className="snap-center">
						<img
							src={placeholder}
							alt=""
							className="h-[300px] w-[200px] rounded-lg object-cover shadow-md"
						/>
						<p className="mt-2 line-clamp-1 w-[200px] text-center text-lg">{book.title}</p>
					</div>
				))}
			</section>
		</section>
	);
}
