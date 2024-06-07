import { Link } from "@remix-run/react";
import { normalizeProps, useMachine } from "@zag-js/react";
import * as tooltip from "@zag-js/tooltip";
import { useId } from "react";

type Book = {
	id: number;
	image: string;
	title: string;
	author: string;
	shortDescription: string;
};

export function BookData({ book }: { book: Book }) {
	const [state, send] = useMachine(
		tooltip.machine({
			id: useId(),
			openDelay: 300,
			closeDelay: 0,
			positioning: {
				placement: "right",
			},
		}),
	);
	const api = tooltip.connect(state, send, normalizeProps);
	return (
		<div>
			{/* @ts-expect-error library types are wrong */}
			<Link
				className="block rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-on-background"
				to={`books/${book.id}`}
				{...api.getTriggerProps()}
			>
				<img
					src={book.image}
					alt={book.title}
					className="h-48 w-32 rounded-lg object-cover shadow-md transition-transform duration-300 hover:scale-105"
				/>
			</Link>
			{api.open && (
				<div {...api.getPositionerProps()} className="z-10">
					<div
						className="[--arrow-background:theme(colors.neutral.50)] [--arrow-size:8px]"
						{...api.getArrowProps()}
					>
						<div {...api.getArrowTipProps()} />
					</div>
					<div
						{...api.getContentProps()}
						className="w-64 rounded-lg border bg-neutral-50 p-4 shadow-lg"
					>
						<h3 className="text-lg font-medium">{book.title}</h3>
						<p className="text-sm">By {book.author}</p>
						<p className="mt-2 text-xs">{book.shortDescription}</p>
					</div>
				</div>
			)}
		</div>
	);
}
