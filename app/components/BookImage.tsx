export type BookImageProps = {
	book: {
		title: string;
		author: string;
		image: string;
		imageScaled: string;
	};
	className?: string;
};

export function BookImage({ book, className }: BookImageProps) {
	return (
		<picture>
			<source srcSet={`${book.image} 1x, ${book.imageScaled} 2x`} type="image/avif" />
			<img src={book.image} alt={`${book.title} by ${book.author}`} className={className} />
		</picture>
	);
}
