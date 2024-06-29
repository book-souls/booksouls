import { Transition } from "@headlessui/react";
import { Link } from "@remix-run/react";
import { normalizeProps, Portal, useMachine } from "@zag-js/react";
import * as tooltip from "@zag-js/tooltip";
import { useId } from "react";
import { BookImage } from "./BookImage";

export type BookCardProps = {
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
			openDelay: 500,
			closeDelay: 0,
			positioning: {
				placement: "right",
			},
			closeOnScroll: false,
		}),
	);
	const api = tooltip.connect(state, send, normalizeProps);
	return (
		<>
			{/* @ts-expect-error Zag's types don't allow <a> tags */}
			<Link
				{...api.getTriggerProps()}
				to={`/books/${book.id}`}
				className="block rounded-lg transition-transform duration-300 hover:scale-105 focus-visible:scale-105 focus-visible:outline-none motion-reduce:duration-0"
			>
				<BookImage book={book} className="h-[240px] w-[160px] rounded-lg shadow-md" />
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
							className="!block max-w-64 rounded-lg bg-floating p-3 text-sm text-on-floating shadow-lg"
						>
							{book.shortDescription}
						</p>
					</div>
				</Transition>
			</Portal>
		</>
	);
}
