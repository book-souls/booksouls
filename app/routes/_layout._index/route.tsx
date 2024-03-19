import { useLoaderData } from "@remix-run/react";
import placeholder from "~/assets/placeholder.jpeg";
import Read from "~/assets/read.svg?react";
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
			<section>
				<div className="p-12">
					<h2 className="mb-8 text-center text-5xl font-medium uppercase">Featured Books</h2>
					<FeaturedBooksGrid books={featuredBooks} />
				</div>
				<FeaturedBooksSlider books={featuredBooks} />
			</section>
			<div className="space-y-8 py-12">
				{books.map(([genre, genreBooks]) => (
					<GenreSection key={genre} genre={genre} books={genreBooks} />
				))}
			</div>
		</main>
	);
}

function FeaturedBooksGrid({ books }: { books: Book[] }) {
	return (
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
	);
}

function FeaturedBooksSlider({ books }: { books: Book[] }) {
	return (
		<section
			// eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
			tabIndex={0}
			aria-label={`Featured books. ${books.length} slides.`}
			className="flex snap-x snap-mandatory overflow-x-auto bg-gradient-to-r from-primary to-primary-light py-8 text-on-primary focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-primary"
		>
			{books.map((book, index) => (
				<div
					key={book.id}
					aria-label={`Slide ${index + 1}`}
					className="flex shrink-0 basis-full snap-center items-center justify-center gap-12"
				>
					<img src={placeholder} alt="" className="h-[375px] w-[250px] rounded-xl object-cover" />
					<div className="max-w-lg">
						<h3 className="text-3xl">{book.title}</h3>
						<p className="mt-4">{book.shortDescription}</p>
					</div>
				</div>
			))}
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
