import { useLoaderData } from "@remix-run/react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useId } from "react";
import placeholder from "~/assets/placeholder.jpeg";
import Read from "~/assets/read.svg?react";
import { IconButton } from "~/components/IconButton";
import { useSnapCarousel } from "~/hooks/snap-carousel";
import { loader, type Book } from "./loader.server";

export { loader };

export default function Page() {
	const { books, featuredBooks } = useLoaderData<typeof loader>();
	return (
		<main>
			<section className="flex max-h-[calc(100vh-var(--header-h))] min-h-[400px] flex-col items-center bg-surface pt-8 text-on-surface">
				<h1 className="mb-16 text-center text-6xl font-thin uppercase">Get Engulfed</h1>
				<Read role="img" aria-label="A person sitting on a chair reading a book" />
				<div className="line-gradient" />
			</section>
			<FeaturedBooksSection books={featuredBooks} />
			<FeaturedBooksCarousel books={featuredBooks} />
			<div className="space-y-6 py-12">
				{books.map(([genre, genreBooks]) => (
					<GenreSection key={genre} genre={genre} books={genreBooks} />
				))}
			</div>
		</main>
	);
}

function FeaturedBooksSection({ books }: { books: Book[] }) {
	const headerId = useId();
	return (
		<section aria-labelledby={headerId} className="py-12">
			<h2 id={headerId} className="mb-8 text-center text-5xl font-medium uppercase">
				Featured Books
			</h2>
			<div className="mx-auto grid w-fit grid-cols-4 gap-8">
				{books.map((book) => (
					<div key={book.id}>
						<img
							src={placeholder}
							alt=""
							className="h-[300px] w-[200px] rounded-lg object-cover shadow-md"
						/>
						<p className="mt-2 w-[200px] text-center text-lg">{book.title}</p>
					</div>
				))}
			</div>
		</section>
	);
}

function FeaturedBooksCarousel({ books }: { books: Book[] }) {
	const { scrollRef, pages, activePageIndex, scrollPrev, scrollNext } = useSnapCarousel({
		slides: books.length,
		slidesPerPage: 1,
	});
	const scrollId = useId();
	return (
		<section
			aria-roledescription="carousel"
			aria-label="Featured books"
			className="bg-gradient-to-r from-primary to-primary-light text-on-primary"
		>
			<div
				ref={scrollRef}
				id={scrollId}
				aria-live="polite"
				className="relative flex snap-x snap-mandatory overflow-x-auto pb-6 pt-8 scrollbar-hidden"
			>
				{books.map((book, index) => {
					const labelId = `${scrollId}-label-${index}`;
					return (
						<div
							key={book.id}
							role="group"
							aria-roledescription="slide"
							aria-labelledby={labelId}
							aria-hidden={activePageIndex !== index}
							className="flex shrink-0 basis-full snap-center items-center justify-center gap-12"
						>
							<span id={labelId} className="sr-only">
								{`${index + 1} of ${books.length}`}
							</span>
							<img
								src={placeholder}
								alt=""
								className="h-[375px] w-[250px] rounded-xl object-cover"
							/>
							<div className="w-[400px]">
								<h3 className="text-3xl">{book.title}</h3>
								<p className="mt-4">{book.shortDescription}</p>
							</div>
						</div>
					);
				})}
			</div>
			<div className="flex items-center justify-center pb-4">
				<IconButton
					aria-label="Go to the previous slide"
					aria-controls={scrollId}
					aria-disabled={activePageIndex === 0}
					onClick={scrollPrev}
				>
					<ChevronLeftIcon />
				</IconButton>
				<p aria-hidden className="w-32 text-center text-sm font-medium">
					{activePageIndex + 1} / {pages.length}
				</p>
				<IconButton
					aria-label="Go to the next slide"
					aria-controls={scrollId}
					aria-disabled={activePageIndex === pages.length - 1}
					onClick={scrollNext}
				>
					<ChevronRightIcon />
				</IconButton>
			</div>
		</section>
	);
}

function GenreSection({ genre, books }: { genre: string; books: Book[] }) {
	const {
		scrollRef,
		pages,
		activePageIndex,
		snapPointIndexes,
		scrollPrev,
		scrollNext,
		slideHidden,
	} = useSnapCarousel({
		slides: books.length,
		slidesPerPage: 4,
	});

	const id = useId();
	const headerId = `${id}-header`;
	const scrollId = `${id}-scroll`;

	return (
		<section aria-roledescription="carousel" aria-labelledby={headerId} className="mx-auto w-fit">
			<div className="flex justify-between px-[12px]">
				<h3 id={headerId} className="text-2xl font-medium">
					{genre}
				</h3>
				<p
					aria-hidden
					className="h-fit rounded-md bg-on-background/10 px-4 py-1.5 text-center text-sm font-medium"
				>
					{activePageIndex + 1} / {pages.length}
				</p>
			</div>
			<div aria-live="polite">
				<span className="sr-only">{`Page ${activePageIndex + 1} of ${pages.length}`}</span>
				<div
					ref={scrollRef}
					id={scrollId}
					// 896px = 4 * (200px + 2 * 12px)
					className="flex w-[896px] snap-x snap-mandatory overflow-x-auto pb-6 pt-4 scrollbar-hidden"
				>
					{books.map((book, index) => (
						<div
							key={book.id}
							role="group"
							aria-roledescription="slide"
							aria-label={`${index + 1} of ${books.length}`}
							aria-hidden={slideHidden(index)}
							data-snap-point={snapPointIndexes.has(index)}
							className="shrink-0 px-[12px] data-[snap-point='true']:snap-start"
						>
							<img
								src={placeholder}
								alt=""
								className="h-[300px] w-[200px] rounded-lg object-cover shadow-md"
							/>
							<p className="mt-2 line-clamp-1 w-[200px] text-center text-lg">{book.title}</p>
						</div>
					))}
				</div>
			</div>
			<div className="flex items-center justify-center gap-32">
				<IconButton
					aria-label="Go to the previous page"
					aria-controls={scrollId}
					aria-disabled={activePageIndex === 0}
					onClick={scrollPrev}
				>
					<ChevronLeftIcon />
				</IconButton>
				<IconButton
					aria-label="Go to the next page"
					aria-controls={scrollId}
					aria-disabled={activePageIndex === pages.length - 1}
					onClick={scrollNext}
				>
					<ChevronRightIcon />
				</IconButton>
			</div>
		</section>
	);
}
