import { Transition } from "@headlessui/react";
import { Link } from "@remix-run/react";
import { normalizeProps, Portal, useMachine } from "@zag-js/react";
import * as tooltip from "@zag-js/tooltip";
import { useId } from "react";

type BookCardProps = {
	book: {
		id: number;
		image: string;
		imageScaled: string;
		title: string;
		author: string;
		shortDescription: string;
	};
};

export function BookCard({ book }: BookCardProps) {
	const id = useId();
	const [state, send] = useMachine(
		tooltip.machine({
			id,
			openDelay: 300,
			closeDelay: 0,
			positioning: {
				placement: "right",
			},
		}),
	);
	const api = tooltip.connect(state, send, normalizeProps);
	return (
		<>
			{/* @ts-expect-error Zag's types don't allow <a> tags */}
			<Link
				{...api.getTriggerProps()}
				to={`/books/${book.id}`}
				className="rounded-lg transition-transform duration-300 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
			>
				<picture className="rounded-[inherit]">
					<source srcSet={`${book.image} 1x, ${book.imageScaled} 2x`} type="image/avif" />
					<img
						src={book.image}
						alt={`${book.title} by ${book.author}`}
						className="h-[240px] w-[160px] rounded-[inherit] shadow-md"
					/>
				</picture>
			</Link>
			<Portal>
				<Transition
					show={api.open}
					enter="transition-opacity duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="transition-opacity"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div {...api.getPositionerProps()}>
						<div
							{...api.getArrowProps()}
							className="[--arrow-background:theme(colors.floating)] [--arrow-size:8px]"
						>
							<div {...api.getArrowTipProps()} />
						</div>
						<p
							{...api.getContentProps()}
							className="bg-floating text-on-floating !block max-w-64 rounded-lg p-3 text-sm shadow-lg"
						>
							{book.shortDescription}
						</p>
					</div>
				</Transition>
			</Portal>
		</>
	);
}
