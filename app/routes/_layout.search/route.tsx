import { Form, Link, useLoaderData, useLocation, useNavigation } from "@remix-run/react";
import { Loader2Icon, Search } from "lucide-react";
import { useEffect, useId } from "react";
import { toast } from "sonner";
import SearchBooks from "~/assets/search-books.svg?react";
import SearchNotFound from "~/assets/search-not-found.svg?react";
import { BookImage } from "~/components/BookImage";
import { loader, type Book } from "./loader.server";

export { loader };

export default function Page() {
	const { results, error } = useLoaderData<typeof loader>();
	return (
		<main>
			<div className="px-8 pt-16">
				<SearchForm error={error} />
				<div aria-live="polite">
					<SearchResults results={results} />
				</div>
			</div>
			<div className="line-gradient" />
		</main>
	);
}

function SearchForm({ error }: { error: boolean | null }) {
	const descriptionId = useId();
	const location = useLocation();
	const query = new URLSearchParams(location.search).get("query") ?? "";
	return (
		<Form>
			<div className="mx-auto flex w-[600px] max-w-full border-2 border-primary focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-current">
				<input
					type="text"
					name="query"
					defaultValue={query}
					placeholder="Search..."
					required
					aria-label="Search"
					aria-describedby={descriptionId}
					className="w-full bg-transparent px-3 placeholder:text-primary/60 focus:outline-none"
				/>
				<SearchSubmit error={error} />
			</div>
			<p id={descriptionId} className="mx-auto mt-3 w-[400px] text-center">
				Our <strong className="font-medium">AI-Powered Search</strong> helps you discover books
				matching your description
			</p>
		</Form>
	);
}

function SearchSubmit({ error }: { error: boolean | null }) {
	const navigation = useNavigation();
	const idle = navigation.state === "idle";
	const loading = navigation.state === "loading";

	useEffect(() => {
		if (!idle || !error) {
			return;
		}

		toast.error("Failed to search. Please try again later.");
	}, [idle, error]);

	return (
		<button
			type="submit"
			tabIndex={-1}
			aria-disabled={loading}
			aria-label={loading ? "Searching" : "Search"}
			className="flex h-12 w-12 shrink-0 items-center justify-center bg-primary text-on-primary"
		>
			{loading ? <Loader2Icon className="animate-spin" /> : <Search />}
		</button>
	);
}

function SearchResults({ results }: { results: Book[] | null }) {
	if (results === null) {
		return (
			<SearchBooks
				role="img"
				aria-label="A woman searching for books"
				className="mx-auto mt-12 h-auto w-[400px] max-w-full"
			/>
		);
	}

	if (results.length === 0) {
		return <SearchResultsNotFound />;
	}

	return <SearchResultsList results={results} />;
}

function SearchResultsNotFound() {
	const headerId = useId();
	return (
		<section aria-labelledby={headerId} className="pt-12">
			<h1 id={headerId} className="text-center text-2xl font-medium text-[#DE2A4C]">
				No Search Results Found!
			</h1>
			<SearchNotFound
				role="img"
				aria-label="No results found"
				className="mx-auto mt-8 h-auto w-[400px] max-w-full"
			/>
		</section>
	);
}

function SearchResultsList({ results }: { results: Book[] }) {
	const headerId = useId();
	return (
		<section aria-labelledby={headerId} className="mx-auto max-w-3xl py-12">
			<h1 id={headerId} className="text-2xl font-medium">
				{results.length} Results Found
			</h1>
			<ul className="flex flex-col gap-8 pt-8">
				{results.map((book) => (
					<li key={book.id} className="flex gap-8">
						<Link to={`/books/${book.id}`} tabIndex={-1} className="shrink-0">
							<BookImage
								book={book}
								className="h-[180px] w-[120px] rounded shadow-md transition-transform duration-300 hover:scale-105"
							/>
						</Link>
						<div className="flex-grow">
							<div className="flex justify-between">
								<div>
									<h2 className="text-xl font-medium">
										<Link
											to={`/books/${book.id}`}
											className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
										>
											{book.title}
										</Link>
									</h2>
									<p className="mt-2 text-on-background/85">{book.author}</p>
								</div>
								<div className="flex gap-2">
									{book.genres.map((genre) => (
										<p
											key={genre}
											className="h-fit rounded bg-primary px-2 py-1 text-sm text-on-primary"
										>
											{genre}
										</p>
									))}
								</div>
							</div>
							<p className="mt-5 text-gray-800">{book.shortDescription}</p>
						</div>
					</li>
				))}
			</ul>
		</section>
	);
}
