import React, { useEffect, useRef, useState } from "react";

export type TypewriterProps = {
	tag: keyof React.JSX.IntrinsicElements;
	children: string;
	duration: number;
	delay?: number;
	flicker?: boolean;
	id?: string;
	className?: string;
};

export function Typewriter({
	tag: Tag,
	children,
	duration,
	delay = 0,
	id,
	className,
}: TypewriterProps) {
	const [index, setIndex] = useState(0);
	const [typing, setTyping] = useState(false);
	const durationRef = useRef(duration);
	const delayRef = useRef(delay);

	useEffect(() => {
		durationRef.current = duration;
	}, [duration]);

	useEffect(() => {
		delayRef.current = delay;
	}, [delay]);

	useEffect(() => {
		let requestId: number;
		const timeoutId = window.setTimeout(() => {
			setTyping(true);

			let start: number | null = null;
			requestId = window.requestAnimationFrame(function updateText(timestamp) {
				if (start === null) {
					start = timestamp;
				}

				const frequnecy = durationRef.current / children.length;
				const index = Math.floor((timestamp - start) / frequnecy);
				setIndex(index);

				if (index < children.length) {
					window.requestAnimationFrame(updateText);
				} else {
					setTyping(false);
				}
			});
		}, delayRef.current);

		return () => {
			window.clearTimeout(timeoutId);
			window.cancelAnimationFrame(requestId);
			setIndex(0);
			setTyping(false);
		};
	}, [children]);

	return (
		<div>
			<Tag id={id} className="sr-only">
				{children}
			</Tag>
			<noscript>
				<p aria-hidden className={className}>
					{children}
				</p>
			</noscript>
			<p aria-hidden className={className}>
				{children.slice(0, index)}
				{typing && (
					<>
						{" "}
						<span className="inline-block h-[0.75em] w-[0.5ch] bg-current" />
					</>
				)}
			</p>
		</div>
	);
}
