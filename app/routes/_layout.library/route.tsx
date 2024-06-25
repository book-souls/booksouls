import { useLoaderData } from "@remix-run/react";
import LibraryPlaceholderIcon from "~/assets/library-placeholder.svg?react";
import { BookCard } from "~/components/BookCard";
import { loader, type FavoriteBook } from "./loader.server";

export { loader };

export default function Page() {
	const { books } = useLoaderData<typeof loader>();
	return (
		<main>
			<h1 className="mt-10 text-center text-4xl font-medium">Library</h1>
			<Books books={books} />
		</main>
	);
}

export function Books({ books }: { books: FavoriteBook[] }) {
	if (books.length === 0) {
		return <EmptyBooks />;
	}

	return (
		<ul role="list" className="mx-auto grid w-fit grid-cols-4 gap-8 p-8 xl:grid-cols-5">
			{books.map((book) => (
				<li key={book.id}>
					<BookCard book={book} />
				</li>
			))}
		</ul>
	);
}

function EmptyBooks() {
	return (
		<>
			<p className="mb-6 mt-8 text-center text-xl">Looks like your library is empty</p>
			<LibraryPlaceholderIcon
				role="img"
				aria-label="A person sitting on a chair reading a book"
				className="mx-auto h-auto w-[300px]"
			/>
		</>
	);
}
