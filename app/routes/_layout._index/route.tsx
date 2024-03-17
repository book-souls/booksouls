import { useLoaderData } from "@remix-run/react";
import placeholder from "~/assets/placeholder.jpeg";
import Read from "~/assets/read.svg?react";
import { BookCard } from "~/components/BookCard";
import { loader, type Book } from "./loader.server";

export { loader };

export default function Page() {
	const { books, featuredBooks } = useLoaderData<typeof loader>();
	return (
		<main>
			<section className="bg-surface text-on-surface">
				<div className="px-8 pt-8">
					<h1 className="text-center text-6xl font-thin uppercase">Get Engulfed</h1>
					<Read
						role="img"
						aria-label="A person sitting on a chair reading a book"
						className="mx-auto mt-16"
					/>
				</div>
				<div className="line-gradient" />
			</section>
			<section>
				<div className="p-12">
					<h2 className="text-center text-5xl font-medium uppercase">Featured Books</h2>
					<FeaturedBooksGrid featuredBooks={featuredBooks} />
				</div>
				<FeaturedBooksSlider featuredBooks={featuredBooks} />
			</section>
			<div className="space-y-8 py-12">
				{Object.keys(books).map((genre) => (
					<GenreSection key={genre} genre={genre} books={books[genre]} />
				))}
			</div>
		</main>
	);
}

function FeaturedBooksGrid({ featuredBooks }: { featuredBooks: Book[] }) {
	return (
		<div className="mx-auto mt-8 grid w-fit grid-cols-4 gap-12">
			{featuredBooks.map((book) => (
				<BookCard key={book.id} book={book} />
			))}
		</div>
	);
}

function FeaturedBooksSlider({ featuredBooks }: { featuredBooks: Book[] }) {
	return (
		<section
			// eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
			tabIndex={0}
			aria-live="polite"
			aria-label="Featured books slides"
			className="flex snap-x snap-mandatory overflow-x-auto bg-gradient-to-r from-primary to-primary-light p-12 text-on-primary focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-8 focus-visible:outline-current"
		>
			{featuredBooks.map((book, index) => (
				<FeaturedBookSlide key={book.id} book={book} index={index} />
			))}
		</section>
	);
}

function FeaturedBookSlide({ book, index }: { book: Book; index: number }) {
	return (
		<div
			data-slide
			aria-label={`Slide ${index + 1}`}
			className="flex shrink-0 basis-full snap-center items-center justify-center gap-12"
		>
			<img
				src={placeholder}
				alt={book.title}
				className="h-[375px] w-[250px] rounded-xl object-cover shadow-md"
			/>
			<div className="max-w-lg">
				<h3 className="text-3xl">{book.title}</h3>
				<p className="mt-2">{book.shortDescription}</p>
			</div>
		</div>
	);
}

function GenreSection({ genre, books }: { genre: string; books: Book[] }) {
	return (
		<section>
			<h3 className="ml-8 text-2xl font-medium">{genre}</h3>
			<div className="flex overflow-x-auto">
				{books.map((book) => (
					<div key={book.id} className="shrink-0 py-4 pl-8 last:pr-8">
						<BookCard book={book} />
					</div>
				))}
			</div>
		</section>
	);
}
