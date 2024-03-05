import { Link } from "@remix-run/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import placeholder from "~/assets/placeholder.jpeg";

export default function Search() {
	return (
		<main className="flex gap-10 px-12 pb-6 pt-[100px]">
			<section className="">
				<div className="mb-8 flex h-[60px] w-[200px] items-center justify-center rounded-xl bg-gradient-to-r from-primary to-primary-light p-4">
					<h2 className="text-2xl text-on-primary">Filters</h2>
				</div>

				<div className="mb-8">
					<label htmlFor="pub-year" className="text-xl text-primary">
						Publish Year
					</label>
					<select
						id="pub-year"
						className="h-10 w-full resize-none rounded-xl bg-gradient-to-r from-primary to-primary-light text-on-primary"
					>
						<option value="" hidden></option>
						<option value="option1" className="text-surface">
							Option 1
						</option>
						<option value="option2" className="text-surface">
							Option 2
						</option>
						<option value="option3" className="text-surface">
							Option 3
						</option>
					</select>
				</div>

				<div className="mb-8">
					<label htmlFor="special-offer" className="text-xl text-primary">
						Specal Offer
					</label>
					<select
						id="special-offer"
						className="h-10 w-full resize-none rounded-xl bg-gradient-to-r from-primary to-primary-light text-on-primary"
					>
						<option value="" hidden></option>
						<option value="option1" className="text-surface">
							Option 1
						</option>
						<option value="option2" className="text-surface">
							Option 2
						</option>
						<option value="option3" className="text-surface">
							Option 3
						</option>
					</select>
				</div>

				<div className="mb-8">
					<label htmlFor="category" className="text-xl text-primary">
						Category
					</label>
					<select
						id="category"
						className="h-10 w-full resize-none rounded-xl bg-gradient-to-r from-primary to-primary-light text-on-primary"
					>
						<option value="" hidden></option>
						<option value="option1" className="text-surface">
							Option 1
						</option>
						<option value="option2" className="text-surface">
							Option 2
						</option>
						<option value="option3" className="text-surface">
							Option 3
						</option>
					</select>
				</div>
			</section>
			<section className="mx-auto w-fit">
				<h1 className="text-3xl text-primary/75">Search Result</h1>
				<div className="mt-8 grid grid-cols-4 gap-16">
					<Book href="#" image={placeholder} />
					<Book href="#" image={placeholder} />
					<Book href="#" image={placeholder} />
					<Book href="#" image={placeholder} />
					<Book href="#" image={placeholder} />
					<Book href="#" image={placeholder} />
					<Book href="#" image={placeholder} />
					<Book href="#" image={placeholder} />
					<Book href="#" image={placeholder} />
					<Book href="#" image={placeholder} />
				</div>
				<div className="mt-16 flex items-center justify-center gap-60">
					<button className="flex items-center gap-1 text-xl text-primary">
						<ChevronLeft className="text-[#212121]/30" />
						Back
					</button>
					<button className="flex items-center gap-1 text-xl text-primary">
						Forward
						<ChevronRight className="text-[#212121]/30" />
					</button>
				</div>
			</section>
		</main>
	);
}

function Book({ href, image }: { href: string; image: string }) {
	return (
		<Link className="w-[200px]" to={href}>
			<img
				src={image}
				alt="Book"
				className="h-[300px] w-[200px] rounded-xl object-cover shadow-md"
			/>
			<p className="mt-2 text-center text-xl">ketab</p>
		</Link>
	);
}
