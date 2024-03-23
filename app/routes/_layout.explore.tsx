import type { LoaderFunctionArgs } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { createServerClient } from "app/supabase/client.server";
import { Search } from "lucide-react";
import SearchBook from "~/assets/search-books.svg?react";

export async function loader({ request }: LoaderFunctionArgs) {
	const headers = new Headers();
	const supabase = createServerClient(request, headers);
	const url = new URL(request.url);
	const query = url.searchParams.get("query");
	console.log(query);

	if (query) {
		const auth = `Bearer ${process.env.HF_API_KEY}`;

		const response = await fetch(
			"https://api-inference.huggingface.co/models/booksouls/fasttext-skipgram",
			{
				headers: { Authorization: auth },
				method: "POST",
				body: JSON.stringify(query),
			},
		);
		const q_embedding = await response.json();

		console.log(q_embedding);

		const { data: nbook, error } = await supabase.rpc("match_books", {
			query_embedding: q_embedding, // pass the query embedding
			match_threshold: 0, // choose an appropriate threshold for your data
			match_count: 2, // choose the number of matches
		});

		if (error !== null) {
			throw error;
		}

		nbook.forEach((item) => {
			console.log(item.title);
		});
	}

	return null;
}

export default function Explore() {
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
				<SearchBook className="mx-auto mt-8 h-auto w-[500px]" />
			</div>
			<div className="line-gradient"></div>
		</main>
	);
}
