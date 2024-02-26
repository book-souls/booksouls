import { faker } from "@faker-js/faker";
import { useLoaderData } from "@remix-run/react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import React from "react";
import placeholder from "~/assets/placeholder.jpeg";
import Read from "~/assets/read.svg?react";
import { IconButton } from "~/components/IconButton";
import { LineGradient } from "~/components/LineGradient";

function createFakeBook() {
	return {
		id: faker.number.int(),
		name: faker.commerce.productName(),
		description: faker.commerce.productDescription(),
	};
}

type Book = ReturnType<typeof createFakeBook>;

export function loader() {
	return {
		featuredBooks: faker.helpers.multiple(createFakeBook, { count: 8 }),
	};
}

export default function Page() {
	const { featuredBooks } = useLoaderData<typeof loader>();
	return (
		<main>
			<section className="text-brand-lightest bg-brand flex flex-col items-center">
				<h1 className="mt-12 text-center text-6xl font-thin uppercase">Get Engulfed</h1>
				<Read className="mt-20" />
				<LineGradient />
			</section>
			<section className="bg-brand-lightest text-brand flex flex-col items-center p-8">
				<h1 className="text-center text-7xl font-medium uppercase">Featured Books</h1>
				<p className="text-brand/20 mt-2 text-7xl font-bold">X</p>
				<div className="mt-6 grid grid-cols-4 gap-10">
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
		<div className="relative">
			<div
				ref={ref}
				className="text-brand-lightest from-brand to-brand-light overflow-hidden bg-gradient-to-r"
			>
				<div className="flex items-center">
					{books.map((book) => (
						<FeaturedBooksCarouselItem key={book.id} book={book} />
					))}
				</div>
			</div>
			<div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 justify-center gap-4">
				{books.map((_, i) => (
					<FeaturedBooksCarouselIndicator key={i} active={i === index} />
				))}
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

function FeaturedBooksCarouselIndicator({ active }: { active: boolean }) {
	return (
		<span
			className={`h-2 w-2 rounded-full ${active ? "bg-brand-lightest" : "bg-brand-lightest/25"}`}
			aria-current={active}
		/>
	);
}
