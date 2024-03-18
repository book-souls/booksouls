import { useLoaderData } from "@remix-run/react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import placeholder from "~/assets/placeholder.jpeg";
import Read from "~/assets/read.svg?react";
import { IconButton } from "~/components/IconButton";
import { useCarousel } from "~/hooks/carousel";
import { loader, type Book } from "./loader.server";

export { loader };

export default function Page() {
	const { books, featuredBooks } = useLoaderData<typeof loader>();
	return (
		<main>
			<section className="bg-surface text-on-surface">
				<div className="px-8 pt-8">
					<h1 className="mb-16 text-center text-6xl font-thin uppercase">Get Engulfed</h1>
					<Read
						role="img"
						aria-label="A person sitting on a chair reading a book"
						className="mx-auto"
					/>
				</div>
				<div className="line-gradient" />
			</section>
			<section>
				<div className="p-12">
					<h2 className="mb-8 text-center text-5xl font-medium uppercase">Featured Books</h2>
					<FeaturedBooksGrid featuredBooks={featuredBooks} />
				</div>
				<FeaturedBooksSlider featuredBooks={featuredBooks} />
			</section>
			<div className="space-y-8 py-12">
				{books.map(([genre, genreBooks]) => (
					<GenreSection key={genre} genre={genre} books={genreBooks} />
				))}
			</div>
		</main>
	);
}

function FeaturedBooksGrid({ featuredBooks }: { featuredBooks: Book[] }) {
	return (
		<div className="mx-auto grid w-fit grid-cols-4 gap-12">
			{featuredBooks.map((book) => (
				<div key={book.id}>
					<img
						src={placeholder}
						alt={book.title}
						className="h-[300px] w-[200px] rounded-lg object-cover shadow-md"
					/>
					<p className="mt-2 w-[200px] text-center text-lg">{book.title}</p>
				</div>
			))}
		</div>
	);
}

function FeaturedBooksSlider({ featuredBooks }: { featuredBooks: Book[] }) {
	const [ref, carousel, selectedIndex] = useCarousel();
	return (
		<section
			aria-label="Featured books slides"
			aria-live="polite"
			className="space-y-6 bg-gradient-to-r from-primary to-primary-light pb-4 pt-8 text-on-primary"
		>
			<div ref={ref} className="overflow-hidden">
				<div className="flex">
					{featuredBooks.map((book, index) => (
						<div
							key={book.id}
							aria-label={`Slide ${index + 1}`}
							aria-hidden={index !== selectedIndex}
							className="flex shrink-0 basis-full snap-center items-center justify-center gap-12"
						>
							<img
								src={placeholder}
								alt={book.title}
								className="h-[375px] w-[250px] rounded-xl object-cover shadow-md"
							/>
							<div className="max-w-lg">
								<h3 className="text-3xl">{book.title}</h3>
								<p className="mt-4">{book.shortDescription}</p>
							</div>
						</div>
					))}
				</div>
			</div>
			<div className="flex items-center justify-center">
				<IconButton
					aria-label="Go to the previous slide"
					disabled={selectedIndex === 0}
					onClick={() => carousel?.scrollPrev()}
				>
					<ChevronLeftIcon />
				</IconButton>
				<p aria-hidden className="w-32 text-center">
					{selectedIndex + 1} / {featuredBooks.length}
				</p>
				<span className="sr-only">{`Slide ${selectedIndex + 1} out of ${featuredBooks.length}`}</span>
				<IconButton
					aria-label="Go to the next slide"
					disabled={selectedIndex === featuredBooks.length - 1}
					onClick={() => carousel?.scrollNext()}
				>
					<ChevronRightIcon />
				</IconButton>
			</div>
		</section>
	);
}

function GenreSection({ genre, books }: { genre: string; books: Book[] }) {
	return (
		<section>
			<h3 className="mb-6 ml-8 text-2xl font-medium">{genre}</h3>
			<section
				// eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
				tabIndex={0}
				aria-label={`${genre} books`}
				className="flex snap-x snap-mandatory gap-8 overflow-x-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-current"
			>
				{books.map((book) => (
					<div key={book.id} className="snap-center first:pl-8 last:pr-8">
						<img
							src={placeholder}
							alt={book.title}
							className="h-[300px] w-[200px] rounded-lg object-cover shadow-md"
						/>
						<p className="mt-2 w-[200px] text-center text-lg">{book.title}</p>
					</div>
				))}
			</section>
		</section>
	);
}
