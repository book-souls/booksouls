import { useLoaderData } from "@remix-run/react";
import { useId } from "react";
import Read from "~/assets/read.svg?react";
import { BookCard } from "~/components/BookCard";
import { loader, type FeaturedBook } from "./loader.server";

export { loader };

export default function Page() {
	const { featuredBooks } = useLoaderData<typeof loader>();
	return (
		<main>
			<section className="flex max-h-[calc(100vh-var(--header-h))] min-h-[400px] flex-col items-center bg-surface pt-8 text-on-surface">
				<h1 className="mb-16 text-center text-6xl font-thin uppercase tracking-widest">
					Get Engulfed
				</h1>
				<Read role="img" aria-label="A person sitting on a chair reading a book" />
				<div className="line-gradient" />
			</section>
			<FeaturedBooksSection books={featuredBooks} />
		</main>
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
