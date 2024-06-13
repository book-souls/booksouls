import { useLoaderData } from "@remix-run/react";
import LibraryPlaceholderIcon from "~/assets/library-placeholder.svg?react";
import { BookCard } from "~/components/BookCard";
import { loader, type FavoriteBook } from "./loader.server";

export { loader };

export default function Library() {
	const { books } = useLoaderData<typeof loader>();
	return (
		<main>
			<h1 className="mb-4 mt-8 text-center text-4xl font-medium">Library</h1>
			<div className="mx-auto h-px w-[600px] max-w-full bg-primary/20" />
			<Books books={books} />
		</main>
	);
}

export function Books({ books }: { books: FavoriteBook[] }) {
	if (books.length === 0) {
		return <EmptyBooks />;
	}

	return (
		<div className="mx-auto grid w-fit grid-cols-4 gap-8 pb-8 pt-12">
			{books.map((book) => (
				<BookCard key={book.id} book={book} />
			))}
		</div>
	);
}

function EmptyBooks() {
	return (
		<>
			<p className="mb-8 mt-12 text-center text-xl">Looks like your library is empty</p>
			<LibraryPlaceholderIcon
				role="img"
				aria-label="A person sitting on a chair reading a book"
				className="mx-auto h-auto w-[300px]"
			/>
		</>
	);
}
