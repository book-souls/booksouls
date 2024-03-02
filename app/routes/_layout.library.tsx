import { Link, useLoaderData } from "@remix-run/react";
import placeholder from "~/assets/placeholder.jpeg";

function createPlaceholderBook() {
	return {
		image: placeholder,
		id: Math.random(),
		title: "Lorem ipsum",
	};
}

type book = ReturnType<typeof createPlaceholderBook>;

export function loader() {
	return {
		books: Array(8).fill(null).map(createPlaceholderBook),
	};
}

export default function library() {
	const { books } = useLoaderData<typeof loader>();
	return (
		<main className="p-4">
			<h1 className="mt-6 text-center text-4xl font-medium ">Welcome User Name</h1>
			<div className="mx-auto mt-4 h-px w-[600px] max-w-full bg-[#1F5F8B]/20"></div>
			<section className="flex flex-col items-center p-8">
				<h2 className="text-center text-3xl font-medium">Your Library</h2>
				<BookGrid books={books}></BookGrid>
			</section>
		</main>
	);
}

function Book({ book }: { book: book }) {
	return (
		<div>
			<img
				src={book.image}
				alt={book.title}
				className="mx-auto h-[285px] w-[200px] rounded-xl object-cover shadow-lg"
			/>

			<Link to="#" className="mt-2 block text-center text-lg hover:underline">
				{book.title}
			</Link>
		</div>
	);
}

function BookGrid({ books }: { books: book[] }) {
	return (
		<div className="mt-6 grid grid-cols-4 gap-x-16 gap-y-10">
			{books.map((book) => (
				<Book key={book.id} book={book} />
			))}
		</div>
	);
}
