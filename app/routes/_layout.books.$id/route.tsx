import { Await, Link, useFetcher, useLoaderData } from "@remix-run/react";
import type { User } from "@supabase/supabase-js";
import { AlertCircleIcon, Star } from "lucide-react";
import React, { Suspense, useEffect } from "react";
import { toast } from "sonner";
import { BookCard } from "~/components/BookCard";
import { BookImage } from "~/components/BookImage";
import { action } from "./action.server";
import { loader, type SimilarBook } from "./loader.server";

export { loader, action };

export default function Page() {
	const { book, favorite, user, similarBooks } = useLoaderData<typeof loader>();
	return (
		<main className="mx-auto max-w-4xl px-8">
			<section className="flex items-center gap-8 pt-12">
				<div className="shrink-0">
					<BookImage book={book} className="h-[270px] w-[180px] rounded-xl shadow-md" />
				</div>
				<div>
					<div className="flex justify-between gap-8">
						<div>
							<h1 className="text-2xl font-medium">{book.title}</h1>
							<p className="mt-2 text-lg">{book.author}</p>
						</div>
						<ul role="list" aria-label="Genres" className="flex gap-2">
							{book.genres.map((genre) => (
								<li key={genre}>
									<p className="h-fit text-nowrap rounded bg-primary px-2 py-1 text-sm text-on-primary">
										{genre}
									</p>
								</li>
							))}
						</ul>
					</div>
					<p className="mt-4 text-gray-800">{book.shortDescription}</p>
					<div className="mt-8 flex items-center gap-8">
						<Link
							to={`/read/${book.id}`}
							className=" flex h-12 w-fit items-center justify-center rounded-xl bg-gradient-to-r from-primary to-primary-light px-8 text-xl font-medium text-on-primary shadow-inner"
						>
							Read Book
						</Link>
						<FavoriteButton favorite={favorite} user={user} />
					</div>
				</div>
			</section>
			<section className="pt-8">
				<h2 className="text-2xl font-medium">Description</h2>
				<p className="mt-4 leading-7 text-gray-800">{book.description}</p>
			</section>
			<section className="py-8">
				<h2 className="text-2xl font-medium">Similar Books</h2>
				<Suspense fallback={<SimilarBooksPlaceholder />}>
					<Await resolve={similarBooks} errorElement={<SimilarBooksError />}>
						{(books) => <SimilarBooks books={books} />}
					</Await>
				</Suspense>
			</section>
		</main>
	);
}

function FavoriteButton({ favorite, user }: { favorite: boolean; user: User | null }) {
	const fetcher = useFetcher<typeof action>();
	const idle = fetcher.state === "idle";
	const error = fetcher.data?.error;
	const optimisticFavorite = idle ? favorite : fetcher.formData?.get("favorite") === "true";

	useEffect(() => {
		if (!idle || !error) {
			return;
		}

		if (favorite) {
			toast.error("Failed to remove from library");
		} else {
			toast.error("Failed to add to library");
		}
	}, [idle, error, favorite]);

	function onClick(event: React.MouseEvent) {
		if (user === null) {
			event.preventDefault();
			toast.info("You have to be signed in");
		}
	}

	return (
		<fetcher.Form method="post">
			<input type="hidden" name="favorite" value={String(!optimisticFavorite)} />
			<button
				type="submit"
				aria-label="Add to library"
				title="Add to library"
				className="icon-button size-12 rounded-xl text-primary"
				onClick={onClick}
			>
				<Star
					data-filled={optimisticFavorite}
					className="size-9 data-[filled='true']:fill-primary"
				/>
			</button>
		</fetcher.Form>
	);
}

function SimilarBooksPlaceholder() {
	return (
		<div className="flex pb-6 pt-4">
			{Array(4)
				.fill(null)
				.map((_, i) => (
					<div key={i} className="shrink-0 basis-1/4">
						<div className="mx-auto h-[240px] w-[160px] animate-pulse rounded-lg bg-gray-400 shadow-md" />
					</div>
				))}
		</div>
	);
}

function SimilarBooksError() {
	return (
		<div className="flex h-[240px] flex-col items-center justify-center pb-6 pt-4">
			<AlertCircleIcon size={32} className="text-red-600" />
			<p className="mt-3 text-xl">An error has occured</p>
		</div>
	);
}

function SimilarBooks({ books }: { books: SimilarBook[] }) {
	return (
		<ul role="list" className="flex snap-x snap-mandatory overflow-x-auto pb-6 pt-4">
			{books.map((book, i) => (
				<li
					key={book.id}
					data-snap-point={i % 4 === 0}
					className="flex shrink-0 basis-1/4 justify-center data-[snap-point='true']:snap-start"
				>
					<BookCard book={book} />
				</li>
			))}
		</ul>
	);
}
