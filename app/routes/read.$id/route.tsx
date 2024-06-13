import { Transition } from "@headlessui/react";
import { Link, useLoaderData } from "@remix-run/react";
import epubjs, { Contents, Rendition, type Location } from "epubjs";
import { ChevronLeft, ChevronRight, HomeIcon, Loader2Icon, XIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import BotIcon from "~/assets/bot.svg?react";
import { useSummarize } from "../api.summarize/use-summarize";
import { loader } from "./loader.server";

export { loader };

export default function Page() {
	const { epub, title } = useLoaderData<typeof loader>();
	const [loading, setLoading] = useState(true);
	const [atStart, setAtStart] = useState(true);
	const [atEnd, setAtEnd] = useState(false);
	const [showSummarize, setShowSummarize] = useState(false);
	const readerRef = useRef<HTMLDivElement>(null);
	const renditionRef = useRef<Rendition | null>(null);
	const selectionRef = useRef<Selection | null>(null);

	function clearSelection() {
		selectionRef.current?.empty();
		selectionRef.current = null;
		setShowSummarize(false);
	}

	useEffect(() => {
		const reader = readerRef.current;
		if (reader === null) {
			return;
		}

		const book = epubjs(epub);
		const rendition = book.renderTo(reader, {
			height: "100%",
			width: "100%",
			allowScriptedContent: true,
			spread: "always",
		});

		renditionRef.current = rendition;
		rendition.display().then(() => {
			setLoading(false);
		});

		rendition.hooks.content.register((contents: Contents) => {
			contents.document.addEventListener("selectionchange", function () {
				const selection = this.getSelection();
				selectionRef.current = selection;
				setShowSummarize(selection !== null && selection.toString().length > 200);
			});
		});

		rendition.on("relocated", (location: Location) => {
			setAtStart(location.atStart);
			setAtEnd(location.atEnd);
			clearSelection();
		});

		function handleKeyDown(event: KeyboardEvent) {
			switch (event.key) {
				case "ArrowLeft":
					rendition.prev();
					break;
				case "ArrowRight":
					rendition.next();
					break;
				default:
					return;
			}

			event.preventDefault();
		}

		rendition.on("keydown", handleKeyDown);
		document.addEventListener("keydown", handleKeyDown);

		return () => {
			rendition.destroy();
			renditionRef.current = null;
			document.removeEventListener("keydown", handleKeyDown);
			clearSelection();
			setLoading(true);
		};
	}, [epub]);

	function goToPrevious() {
		renditionRef.current?.prev();
	}

	function goToNext() {
		renditionRef.current?.next();
	}

	return (
		<div className="flex h-screen min-h-[600px] w-full items-center justify-center bg-white text-neutral-800">
			<div className="relative h-full max-h-[800px] w-full max-w-[1400px]">
				<header className="absolute top-0 z-10 flex h-12 w-full items-center border-b border-gray-200 px-4 py-2 text-primary">
					<Link to="/" className="icon-button h-8 w-8">
						<HomeIcon aria-label="Home" className="size-4" />
					</Link>
					<h1 className="absolute left-1/2 -translate-x-1/2 font-medium leading-tight">{title}</h1>
				</header>
				<div
					ref={readerRef}
					data-loading={loading}
					className="relative z-0 h-full w-full rounded-lg p-16 after:absolute after:left-1/2 after:top-1/2 after:h-3/4 after:w-px after:-translate-x-1/2 after:-translate-y-1/2 after:bg-gray-400"
				/>
				{loading && (
					<div className="absolute left-1/4 top-1/2 -translate-x-1/2 -translate-y-1/2">
						<Loader2Icon aria-label="Loading" className="size-10 animate-spin text-primary" />
					</div>
				)}
				<button
					aria-disabled={loading || atStart}
					aria-label="Go to the previous page"
					tabIndex={-1}
					className="icon-button absolute left-6 top-1/2 -translate-y-1/2"
					onClick={goToPrevious}
				>
					<ChevronLeft />
				</button>
				<button
					aria-disabled={loading || atEnd}
					aria-label="Go to the next page"
					tabIndex={-1}
					className="icon-button absolute right-6 top-1/2 -translate-y-1/2"
					onClick={goToNext}
				>
					<ChevronRight />
				</button>
				<SummarizeButton shown={showSummarize} selection={selectionRef} />
			</div>
		</div>
	);
}

function SummarizeButton({
	shown,
	selection,
}: {
	shown: boolean;
	selection: React.RefObject<Selection | null>;
}) {
	const { submit, state, summary, error } = useSummarize();
	const dialogRef = useRef<HTMLDialogElement>(null);

	function summarizeSelection() {
		if (!shown || selection.current === null || dialogRef.current === null) {
			return;
		}

		submit(selection.current.toString());
		dialogRef.current.showModal();
	}

	function closeDialog() {
		dialogRef.current?.close();
	}

	return (
		<>
			<Transition
				show={shown}
				enter="transition-opacity duration-300"
				enterFrom="opacity-0"
				enterTo="opacity-100"
				leave="transition-opacity"
				leaveFrom="opacity-100"
				leaveTo="opacity-0"
			>
				<button
					className="absolute bottom-4 left-1/2 flex h-9 -translate-x-1/2 items-center justify-center rounded-md bg-gradient-to-r from-primary to-primary-light px-4 font-medium text-on-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
					onClick={summarizeSelection}
				>
					Summarize
				</button>
			</Transition>
			<dialog
				ref={dialogRef}
				className="relative h-[500px] w-[600px] rounded-xl p-6 pt-16 [&::backdrop]:bg-black/50"
			>
				<button
					// eslint-disable-next-line jsx-a11y/no-autofocus
					autoFocus
					aria-label="Close dialog"
					className="icon-button absolute right-3 top-3 size-8"
					onClick={closeDialog}
				>
					<XIcon className="size-5" />
				</button>
				<div className="ml-auto w-fit rounded-3xl bg-primary-light/35 px-5 py-2.5">
					<p>Summarize the highlighted text</p>
				</div>
				<div className="flex gap-4 pt-6">
					<BotIcon role="img" aria-label="Chatbot" className="shrink-0" />
					<div className="rounded-3xl bg-primary/35 px-5 py-2.5">
						{state === "submitting" ? (
							<ChatLoadingIndicator />
						) : error ? (
							<ChatEffect text="Failed to summarize. Please try again later." />
						) : summary != null ? (
							<ChatEffect text={summary} />
						) : null}
					</div>
				</div>
			</dialog>
		</>
	);
}

function ChatLoadingIndicator() {
	return (
		<svg width={40} height="1rem" aria-label="Loading" className="translate-y-[12.5%]">
			<circle r="4" cx="4" cy="50%" className="animate-bounce" />
			<circle r="4" cx="50%" cy="50%" className="animate-bounce [animation-delay:166ms]" />
			<circle r="4" cx="36" cy="50%" className="animate-bounce [animation-delay:333ms]" />
		</svg>
	);
}

function ChatEffect({ text }: { text: string }) {
	const [index, setIndex] = useState(0);

	useEffect(() => {
		let start: number | null = null;
		const requestId = window.requestAnimationFrame(function update(timestamp) {
			if (start === null) {
				start = timestamp;
			}

			const delayMs = 17.5;
			const index = Math.floor((timestamp - start) / delayMs);
			setIndex(index);

			if (index < text.length) {
				window.requestAnimationFrame(update);
			}
		});

		return () => {
			window.cancelAnimationFrame(requestId);
		};
	}, [text]);

	return <p>{text.slice(0, index)}</p>;
}
