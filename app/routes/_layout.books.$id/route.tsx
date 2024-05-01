import { Await, Link, Links, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";
import { loader, type SimilarBooksResult } from "./loader.server";

export { loader };

export default function Book() {
	const { book, similarBooks } = useLoaderData<typeof loader>();
	return (
		<main className="mx-auto max-w-4xl px-8">
			<section className="flex gap-8 pt-12">
				<img
					className="h-[285px] w-[200px] shrink-0 rounded-lg object-cover shadow-md"
					src={book.image}
					alt={book.title}
				/>
				<div className="flex flex-col justify-center">
					<h1 className="text-4xl font-medium uppercase">{book.title}</h1>
					<p className="mt-2 text-2xl font-medium text-on-background/75">
						{book.genres.join(", ")}
					</p>
					<p className="mt-5 text-lg text-on-background/75">{book.shortDescription}</p>
					<Link
						to={`/read/${book.id}`}
						className="mt-10 flex h-12 w-fit items-center justify-center rounded-xl bg-gradient-to-r from-primary to-primary-light px-8 text-xl font-medium text-on-primary shadow-inner"
					>
						Read Book
					</Link>
				</div>
			</section>
			<section className="pt-8">
				<h2 className="text-2xl font-medium">Description</h2>
				<p className="mt-4 text-on-background/75">{book.description}</p>
			</section>
			<section className="pb-6 pt-8">
				<h2 className="text-2xl font-medium">Similar Books</h2>
				<Suspense fallback={<SimilarBooksPlaceholder />}>
					<Await resolve={similarBooks}>{(books) => <SimilarBooks books={books} />}</Await>
				</Suspense>
			</section>
		</main>
	);
}

function SimilarBooksPlaceholder() {
	return (
		<div className="flex py-4">
			{Array(4)
				.fill(null)
				.map((_, i) => (
					<div key={i} className="shrink-0 basis-1/4">
						<div className="mx-auto h-[270px] w-[180px] animate-pulse rounded bg-neutral-400 shadow-md" />
					</div>
				))}
		</div>
	);
}

function SimilarBooks({ books }: { books: SimilarBooksResult }) {
	return (
		<div className="flex snap-x snap-mandatory overflow-x-auto py-4">
			{books.map((book, i) => (
				<div
					key={book.id}
					data-snap-point={i % 4 === 0}
					className="shrink-0 basis-1/4 data-[snap-point='true']:snap-start"
				>
					<Link to={`/books/${book.id}`}>
						<img
							src={book.image}
							alt=""
							className="mx-auto h-[270px] w-[180px] rounded object-cover shadow-md"
						/>
					</Link>
					<Link to={`/books/${book.id}`} className="mt-3 block max-w-full text-center text-lg">
						{book.title}
					</Link>
				</div>
			))}
		</div>
	);
}
