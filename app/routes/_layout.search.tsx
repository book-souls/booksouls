import { Link } from "@remix-run/react";
import placeholder from "~/assets/placeholder.jpeg";

export default function search() {
	return (
		<main className="flex px-12 pt-[100px] pb-[10px] gap-10">
			<section className="">

				<div className= "">
					<div className="bg-gradient-to-r from-primary to-primary-light p-4 rounded-xl h-[60px] w-[200px] flex items-center justify-center mb-8">
						<p className="text-2xl text-on-primary">Filters</p>
					</div>

					<div> <p className="text-xl text-blue-900">Publish Year</p></div>
					<div className="mb-8">	
						<select className="w-full h-10 rounded-xl resize-none bg-gradient-to-r from-primary to-primary-light text-on-primary">
							<option value="" hidden></option>
							<option value="option1" className="text-blue-700">Option 1</option>
							<option value="option2" className="text-blue-700">Option 2</option>
							<option value="option3" className="text-blue-700">Option 3</option>
						</select>
					</div>

					<div> <p className="text-xl text-blue-900">Special Offer</p></div>
					<div className="mb-8">
						<select className="w-full h-10 rounded-xl resize-none bg-gradient-to-r from-primary to-primary-light text-on-primary">
							<option value="" hidden></option>
							<option value="option1" className="text-blue-700">Option 1</option>
							<option value="option2" className="text-blue-700">Option 2</option>
							<option value="option3" className="text-blue-700">Option 3</option>
						</select>
					</div>

					<div> <p className="text-xl text-blue-900">Category</p></div>
					<div className="mb-8">
						<select className="w-full h-10 rounded-xl resize-none bg-gradient-to-r from-primary to-primary-light text-on-primary">
							<option value="" hidden></option>
							<option value="option1" className="text-blue-700">Option 1</option>
							<option value="option2" className="text-blue-700">Option 2</option>
							<option value="option3" className="text-blue-700">Option 3</option>
						</select>
					</div>

				</div>

			</section>
			<section className="">
				<h2 className="text-left text-xl font-light">Search Result</h2>
				<div className="mt-6 flex flex-wrap gap-6 mx-auto">
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
				<div className="flex items-center justify-center gap-60 mt-6 mb-6">
					<button className="flex items-center text-blue-900 text-xl"> <span className="text-gray-400 text-4xl font-light">{"<"} </span> Back</button>
					<button className="flex items-center text-blue-900 text-xl">Forward<span className="text-gray-400 text-4xl font-light">{">"} </span></button>
				</div>
			</section>
		</main>
	);
}

function Book({ href, image }: { href: string; image: string }) {
	return (
		<Link className= "w-[200px]" to={href}>
			<img src={image} alt="Book" className="h-[300px] w-[200px] rounded-xl object-cover shadow-md" />
			<p className="mt-2 text-center text-xl">ketab</p>
		</Link>
	);
}
