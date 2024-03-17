import type React from "react";
import placeholder from "~/assets/placeholder.jpeg";

export interface BookCardProps extends React.ComponentProps<"div"> {
	book: {
		id: number;
		title: string;
		image?: string;
	};
}

export function BookCard({ book, ...props }: BookCardProps) {
	return (
		<div {...props}>
			<img
				src={book.image ?? placeholder}
				alt={book.title}
				className="h-[300px] w-[200px] rounded-xl object-cover shadow-md"
			/>
			<p className="mt-2 line-clamp-2 w-[200px] text-center text-xl">{book.title}</p>
		</div>
	);
}
