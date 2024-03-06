import { useLoaderData } from "@remix-run/react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import React from "react";
import placeholder from "~/assets/placeholder.jpeg";
import Read from "~/assets/read.svg?react";
import { IconButton } from "~/components/IconButton";
import { LineGradient } from "~/components/LineGradient";
import { useCarousel } from "~/hooks/carousel";

function createPlaceholderBook() {
	return {
		id: Math.random(),
		name: "Lorem Ipsum",
		description:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec dui nec odio tincidunt luctus at vitae nunc. Nulla nec dui nec odio tincidunt luctus at vitae nunc.",
	};
}

type Book = ReturnType<typeof createPlaceholderBook>;

export function loader() {
	return {
		featuredBooks: Array(8).fill(null).map(createPlaceholderBook),
	};
}

export default function Page() {
	const { featuredBooks } = useLoaderData<typeof loader>();
	return (
		<main>
			<section className="flex h-[calc(100vh-var(--header-h))] flex-col items-center bg-surface pt-8 text-on-surface">
				<h1 className="mb-10 text-center text-6xl font-thin uppercase">Get Engulfed</h1>
				<Read aria-label="A person sitting on a chair reading a book" className="mt-auto" />
				<LineGradient />
			</section>
			<section className="p-8">
				<h2 className="text-center text-5xl font-medium uppercase">Featured Books</h2>
				<div className="mt-2 text-center text-3xl font-black opacity-20">X</div>
				<div className="mx-auto mt-10 grid w-fit grid-cols-4 gap-8">
					{featuredBooks.map((book) => (
						<FeaturedBook key={book.id} book={book} />
					))}
				</div>
			</section>
			<FeaturedBooksCarousel books={featuredBooks.slice(0, 4)} />
		</main>
	);
}

function FeaturedBook({ book }: { book: Book }) {
	return (
		<div className="w-[200px]">
			<img
				src={placeholder}
				alt={`The book "${book.name}"`}
				className="h-[300px] w-[200px] rounded-xl object-cover shadow-md"
			/>
			<p className="mt-2 text-center text-xl">{book.name}</p>
		</div>
	);
}

function FeaturedBooksCarousel({ books }: { books: Book[] }) {
	const [ref, carousel, selectedIndex] = useCarousel();
	return (
		<section
			aria-label="Featured books slides"
			aria-live="polite"
			className="relative bg-gradient-to-r from-primary to-primary-light text-on-primary"
		>
			<IconButton
				aria-label="Previous book"
				disabled={selectedIndex === 0}
				className="absolute left-6 top-1/2 z-10 -translate-y-1/2"
				onClick={() => carousel?.scrollPrev()}
			>
				<ChevronLeftIcon />
			</IconButton>

			<div ref={ref} className="overflow-hidden">
				<div className="flex items-center p-12">
					{books.map((book, i) => (
						<FeaturedBooksCarouselItem
							key={book.id}
							book={book}
							aria-label={`Slide ${i + 1}`}
							aria-hidden={i !== selectedIndex}
						/>
					))}
				</div>
			</div>

			<IconButton
				aria-label="Next book"
				disabled={selectedIndex === books.length - 1}
				className="absolute right-6 top-1/2 -translate-y-1/2"
				onClick={() => carousel?.scrollNext()}
			>
				<ChevronRightIcon />
			</IconButton>

			<ul
				aria-label="Slide indicators"
				className="absolute bottom-4 left-1/2 flex -translate-x-1/2 justify-center gap-4"
			>
				{books.map((_, i) => (
					<li key={i}>
						<FeaturedBooksCarouselIndicator
							aria-label={`Go to slide ${i + 1}`}
							aria-current={i === selectedIndex}
							onClick={() => carousel?.scrollTo(i)}
						/>
					</li>
				))}
			</ul>
		</section>
	);
}

function FeaturedBooksCarouselItem({
	book,
	...props
}: {
	book: Book;
	"aria-label": string;
	"aria-hidden": boolean;
}) {
	return (
		<div className="flex shrink-0 basis-full items-center justify-center gap-12" {...props}>
			<img
				src={placeholder}
				alt={`Book "${book.name}"`}
				className="h-[375px] w-[250px] rounded-xl object-cover shadow-md"
			/>
			<div className="max-w-xl">
				<h3 className="text-3xl">{book.name}</h3>
				<p className="mt-2">{book.description}</p>
			</div>
		</div>
	);
}

function FeaturedBooksCarouselIndicator(props: {
	"aria-label": string;
	"aria-current": boolean;
	onClick: React.MouseEventHandler<HTMLButtonElement>;
}) {
	return (
		<button
			className="
				relative h-2 w-2 rounded-full bg-on-primary/50
				before:absolute before:left-1/2 before:top-1/2 before:h-5 before:w-5 before:-translate-x-1/2 before:-translate-y-1/2
				focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current
				[&[aria-current='true']]:bg-on-primary
			"
			{...props}
		/>
	);
}
