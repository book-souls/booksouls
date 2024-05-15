import { Link, useLoaderData } from "@remix-run/react";
import { loader } from "./loader.server";

export { loader };

export default function Library() {
	const { books } = useLoaderData<typeof loader>();
	return (
		<main className="min-h-[calc(100dvh-var(--header-h))] pt-6">
			<h1 className="text-center text-4xl font-medium">Your Library</h1>
			<div className="mx-auto mt-4 h-px w-[600px] max-w-full bg-[#1F5F8B]/20" />
			<section className="mt-8">
				<div className=" mx-auto grid w-fit grid-cols-4 gap-12 pb-8 pt-8">
					{books.map(({ book }) => (
						<div key={book.id} className="w-[200px] shrink-0 snap-center">
							<Link to={`/books/${book.id}`}>
								<img
									src={book.image}
									alt={book.title}
									className="mx-auto h-[285px] w-[200px] rounded-xl object-cover shadow-lg"
								/>
							</Link>
							<Link to={`/books/${book.id}`} className="mt-2 block text-center text-xl">
								{book.title}
							</Link>
						</div>
					))}
				</div>
			</section>
		</main>
	);
}
