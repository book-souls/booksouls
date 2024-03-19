import { Search } from "lucide-react";
import SearchBook from "~/assets/search-books.svg?react";

export default function Explore() {
	return (
		<main>
			<div className="px-9 pt-16">
				<form action="" className="mx-auto w-fit ">
					<div className="flex border-2 border-primary focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-current">
						<input
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
				</form>
				<SearchBook className="mx-auto mt-8 h-auto w-[500px]" />
			</div>
			<div className="line-gradient"></div>
		</main>
	);
}
