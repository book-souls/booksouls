import { Await, Link, useFetcher, useLoaderData } from "@remix-run/react";
import type { User } from "@supabase/supabase-js";
import { AlertCircleIcon, Star } from "lucide-react";
import React, { Suspense, useEffect } from "react";
import { toast } from "sonner";
import { action } from "./action.server";
import { loader, type SimilarBooksResult } from "./loader.server";

export { loader, action };

export default function Book() {
	const { book, favorite, user, similarBooks } = useLoaderData<typeof loader>();
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
					<div className="mt-10 flex items-center gap-8">
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
				<p className="mt-4 text-on-background/75">{book.description}</p>
			</section>
			<section className="pb-6 pt-8">
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
	const submitting = fetcher.state === "submitting";
	const error = fetcher.data?.error;
	const optimisticFavorite = submitting ? fetcher.formData?.get("favorite") === "true" : favorite;

	useEffect(() => {
		if (submitting || !error) {
			return;
		}

		if (favorite) {
			toast.error("Failed to remove from library");
		} else {
			toast.error("Failed to add to library");
		}
	}, [submitting, error, favorite]);

	function onClick(event: React.MouseEvent) {
		if (user === null) {
			toast.info("You have to be signed in");
			event.preventDefault();
		}
	}

	return (
		<fetcher.Form method="post">
			<input type="hidden" name="favorite" value={String(!optimisticFavorite)} />
			<button
				type="submit"
				className="icon-button size-12 rounded-xl text-primary"
				onClick={onClick}
			>
				<Star
					data-filled={optimisticFavorite}
					className="!size-9 data-[filled='true']:fill-primary"
				/>
			</button>
		</fetcher.Form>
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

function SimilarBooksError() {
	return (
		<div className="py-4">
			<div className="h-[270px]">
				<AlertCircleIcon size={32} className="text-red-600" />
				<p className="text-center text-xl">An error has occured</p>
			</div>
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
