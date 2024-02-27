import { useLoaderData } from "@remix-run/react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import React from "react";
import placeholder from "~/assets/placeholder.jpeg";
import Read from "~/assets/read.svg?react";
import { IconButton } from "~/components/IconButton";
import { LineGradient } from "~/components/LineGradient";

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
			<section className="flex h-[calc(100vh-var(--header-h))] flex-col items-center bg-primary-dark pt-8 text-primary-light">
				<h1 className="mb-10 text-center text-6xl font-thin uppercase">Get Engulfed</h1>
				<Read className="mt-auto" />
				<LineGradient />
			</section>
			<section className="p-8">
				<h1 className="text-center text-5xl font-medium uppercase">Featured Books</h1>
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
	const [ref, carousel] = useEmblaCarousel();
	const [index, setIndex] = React.useState(0);

	React.useEffect(() => {
		function onSelect() {
			if (!carousel) return;
			setIndex(carousel.selectedScrollSnap());
		}

		carousel?.on("select", onSelect);
		return () => {
			carousel?.off("select", onSelect);
		};
	}, [carousel]);

	return (
		<div className="relative bg-gradient-to-r from-primary-dark to-primary text-primary-light">
			<div ref={ref} className="overflow-hidden">
				<div className="flex items-center">
					{books.map((book) => (
						<FeaturedBooksCarouselItem key={book.id} book={book} />
					))}
				</div>
			</div>
			<IconButton
				disabled={index === 0}
				className="
					absolute left-6 top-1/2 -translate-y-1/2
					disabled:text-neutral-300/[38%] disabled:before:opacity-0
				"
				onClick={() => carousel?.scrollPrev()}
			>
				<ChevronLeftIcon />
			</IconButton>
			<IconButton
				disabled={index === books.length - 1}
				className="
					absolute right-6 top-1/2 -translate-y-1/2
					disabled:text-neutral-300/[38%] disabled:before:opacity-0
				"
				onClick={() => carousel?.scrollNext()}
			>
				<ChevronRightIcon />
			</IconButton>
			<div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 justify-center gap-4">
				{books.map((_, i) => (
					<FeaturedBooksCarouselIndicator
						key={i}
						active={i === index}
						onClick={() => carousel?.scrollTo(i)}
					/>
				))}
			</div>
		</div>
	);
}

function FeaturedBooksCarouselItem({ book }: { book: Book }) {
	return (
		<div key={book.id} className="flex flex-[0_0_100%] items-center justify-center gap-12 p-12">
			<img
				src={placeholder}
				alt={`Book "${book.name}"`}
				className="h-[375px] w-[250px] rounded-xl object-cover shadow-md"
			/>
			<div className="max-w-xl">
				<h1 className="text-3xl">{book.name}</h1>
				<p className="mt-2">{book.description}</p>
			</div>
		</div>
	);
}

function FeaturedBooksCarouselIndicator({
	active,
	onClick,
}: {
	active: boolean;
	onClick: React.MouseEventHandler<HTMLButtonElement>;
}) {
	return (
		<button
			onClick={onClick}
			className="
				relative h-2 w-2 rounded-full bg-primary-light/50
				before:absolute before:left-1/2 before:top-1/2 before:h-5 before:w-5 before:-translate-x-1/2 before:-translate-y-1/2
				focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current
				[&[aria-current='true']]:bg-primary-light
			"
			aria-current={active}
		/>
	);
}
