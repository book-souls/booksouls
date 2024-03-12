import { Link, useLoaderData } from "@remix-run/react";
import placeholder from "~/assets/placeholder.jpeg";

function createPlaceholderBook() {
	return {
		id: Math.random(),
		image: placeholder,
		title: "Lorem ipsum",
	};
}

type Book = ReturnType<typeof createPlaceholderBook>;

export function loader() {
	return {
		books: Array(16).fill(null).map(createPlaceholderBook),
	};
}

export default function Library() {
	const { books } = useLoaderData<typeof loader>();
	return (
		<main className="min-h-[calc(100dvh-var(--header-h))] pt-6">
			<h1 className="text-center text-4xl font-medium">Welcome User Name</h1>
			<div className="mx-auto mt-4 h-px w-[600px] max-w-full bg-[#1F5F8B]/20" />
			<section className="mt-8">
				<h2 className="text-center text-3xl font-medium">Your Library</h2>
				<BookGrid books={books} />
			</section>
		</main>
	);
}

function BookGrid({ books }: { books: Book[] }) {
	return (
		<div className="mt-6 flex w-full snap-x snap-mandatory gap-12 overflow-x-auto pb-8">
			{books.map((book) => (
				<Book key={book.id} book={book} />
			))}
		</div>
	);
}

function Book({ book }: { book: Book }) {
	return (
		<div className="first:ml-auto first:pl-8 last:mr-auto last:pr-8">
			<div className="w-[200px] shrink-0 snap-center">
				<img
					src={book.image}
					alt={book.title}
					className="mx-auto h-[285px] w-[200px] rounded-xl object-cover shadow-lg"
				/>

				<Link to="#" className="mt-2 block text-center text-xl hover:underline">
					{book.title}
				</Link>
			</div>
		</div>
	);
}
