import { useLoaderData, useParams } from "@remix-run/react";
import { BookCard } from "~/components/BookCard";
import { loader } from "./loader.server";

export { loader };

export default function Page() {
	const { books } = useLoaderData<typeof loader>();
	const { genre } = useParams();
	return (
		<main>
			<h1 className="mt-10 text-center text-4xl font-medium">{genre}</h1>
			<ul role="list" className="mx-auto grid w-fit grid-cols-4 gap-8 p-8 xl:grid-cols-5">
				{books.map((book) => (
					<li key={book.id}>
						<BookCard book={book} />
					</li>
				))}
			</ul>
		</main>
	);
}
