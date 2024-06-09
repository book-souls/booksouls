import { useLoaderData, useParams } from "@remix-run/react";
import { loader } from "./loader.server";

export { loader };

export default function GenreBooksPage() {
	const { books } = useLoaderData<typeof loader>();
	const { genre } = useParams();
	return (
		<main className="flex flex-col items-center p-8">
			<h1 className="mb-8 text-center text-3xl font-medium">{genre}</h1>
			<div className="grid grid-cols-5 gap-10">
				{books.map((book) => (
					<div key={book.id}>
						<img
							src={book.image}
							alt={book.title}
							className="h-48 w-32 rounded-lg object-cover shadow-md"
						/>
					</div>
				))}
			</div>
		</main>
	);
}
