import { useLoaderData, useParams } from "@remix-run/react";
import { BookCard } from "~/components/BookCard";
import { loader } from "./loader.server";

export { loader };

export default function Page() {
	const { books } = useLoaderData<typeof loader>();
	const { genre } = useParams();
	return (
		<main className="flex flex-col items-center p-8">
			<h1 className="mb-8 text-center text-4xl font-medium">{genre}</h1>
			<div className="grid grid-cols-4 gap-8">
				{books.map((book) => (
					<BookCard key={book.id} book={book} />
				))}
			</div>
		</main>
	);
}
