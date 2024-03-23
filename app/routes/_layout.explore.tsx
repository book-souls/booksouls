import type { LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { createServerClient } from "app/supabase/client.server";
import { Search } from "lucide-react";
import SearchBook from "~/assets/search-books.svg?react";
import SearchNotFound from "~/assets/search-not-found.svg?react";

export async function loader({ request }: LoaderFunctionArgs) {
	const headers = new Headers();
	const supabase = createServerClient(request, headers);
	const url = new URL(request.url);
	const query = url.searchParams.get("query");
	// console.log(query);

	if (!query) {
		return null;
	}

	const response = await fetch(
		"https://api-inference.huggingface.co/models/booksouls/fasttext-skipgram",
		{
			headers: { Authorization: `Bearer ${process.env.HF_API_KEY}` },
			method: "POST",
			body: query,
		},
	);
	if (!response.ok) {
		throw response;
	}

	const q_embedding = await response.json();

	// console.log(q_embedding);

	const { data: books, error } = await supabase.rpc("match_books", {
		query_embedding: q_embedding, // pass the query embedding
		match_threshold: 0, // choose an appropriate threshold for your data
		match_count: 8, // choose the number of matches
	});

	if (error !== null) {
		throw error;
	}

	// nbook.forEach((item) => {
	// 	console.log(item.title);
	// });

	return books;
}

type Books = {
	id: number | null;
	title: string | null;
	short_description: string | null;
	genres: string[] | null;
}[];

function SearchResults({ books }: { books: Books | null }) {
	if (books === null) {
		return <SearchBook className="mx-auto mt-8 h-auto w-[500px]" />;
	} else if (books.length === 0) {
		return (
			<div>
				<p className="mt-8 text-center text-2xl font-medium text-[#DE2A4C]">
					No Search Results Found!
				</p>
				<SearchNotFound className="mx-auto mt-8 h-auto w-[500px]" />
			</div>
		);
	} else {
		return (
			<div className="mx-auto flex w-fit max-w-4xl flex-col gap-8 p-9">
				{books.map((book) => (
					<div key={book.id} className="flex gap-10">
						<div className="h-[180px] w-[120px] shrink-0 rounded-xl bg-primary shadow-md"></div>
						<div className="flex flex-col justify-center">
							<p className="text-xl font-medium">{book.title}</p>
							<p className="mt-1 text-lg font-medium text-on-background/75">
								{book.genres!.join(", ")}
								{/* TODO: Fix type aka ! */}
							</p>
							<p className="mt-5 text-lg text-on-background/75">{book.short_description}</p>
						</div>
					</div>
				))}
			</div>
		);
	}
}

export default function Explore() {
	const books = useLoaderData<typeof loader>();
	return (
		<main>
			<div className="px-9 pt-16">
				<Form className="mx-auto w-fit ">
					<div className="flex border-2 border-primary focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-current">
						<input
							name="query"
							aria-describedby="search-desc"
							type="text"
							placeholder="Search..."
							className="w-[650px] max-w-full bg-transparent px-3 placeholder:text-primary/60 focus:outline-none"
						/>
						<button className="flex h-12 w-12 items-center justify-center bg-primary text-on-primary">
							<Search />
						</button>
					</div>
					<p id="search-desc" className="mt-2 text-center">
						Search for books by description - <span className="font-medium">Powered by AI</span>
					</p>
				</Form>
				<SearchResults books={books} />
			</div>

			<div className="line-gradient"></div>
		</main>
	);
}
