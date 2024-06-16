import { Transition } from "@headlessui/react";
import { Link, useLoaderData } from "@remix-run/react";
import epubjs, { Contents, Rendition, type Location } from "epubjs";
import { ChevronLeft, ChevronRight, HomeIcon, Loader2Icon, XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import BotIcon from "~/assets/bot.svg?react";
import { useSummarize } from "../api.summarize/use-summarize";
import { loader } from "./loader.server";

export { loader };

export default function Page() {
	const { epub, title } = useLoaderData<typeof loader>();
	const [loading, setLoading] = useState(true);
	const [atStart, setAtStart] = useState(true);
	const [atEnd, setAtEnd] = useState(false);
	const [selectedText, setSelectedText] = useState("");
	const readerRef = useRef<HTMLDivElement>(null);
	const renditionRef = useRef<Rendition | null>(null);

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

		let selection: Selection | null = null;

		rendition.hooks.content.register((contents: Contents) => {
			contents.document.addEventListener("selectionchange", function () {
				selection = this.getSelection();
				setSelectedText(selection?.toString() ?? "");
			});
		});

		rendition.on("relocated", (location: Location) => {
			setAtStart(location.atStart);
			setAtEnd(location.atEnd);

			selection?.empty();
			selection = null;
			setSelectedText("");
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
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [epub]);

	function navigateBack() {
		renditionRef.current?.prev();
	}

	function navigateForward() {
		renditionRef.current?.next();
	}

	return (
		<div className="flex h-screen w-full items-center justify-center bg-white text-neutral-800">
			<div className="relative h-full max-h-[800px] min-h-[600px] w-full max-w-[1400px]">
				<header className="absolute top-0 z-10 flex h-12 w-full items-center border-b border-gray-200 px-4 py-2 text-primary">
					<Link to="/" aria-label="Home" className="icon-button h-8 w-8">
						<HomeIcon className="size-4" />
					</Link>
					<h1 className="absolute left-1/2 -translate-x-1/2 font-medium leading-tight">{title}</h1>
				</header>
				<div
					ref={readerRef}
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
					onClick={navigateBack}
				>
					<ChevronLeft />
				</button>
				<button
					aria-disabled={loading || atEnd}
					aria-label="Go to the next page"
					tabIndex={-1}
					className="icon-button absolute right-6 top-1/2 -translate-y-1/2"
					onClick={navigateForward}
				>
					<ChevronRight />
				</button>
				<SummarizeButton selectedText={selectedText} />
			</div>
		</div>
	);
}

function SummarizeButton({ selectedText }: { selectedText: string }) {
	const { submit, state, summary, error } = useSummarize();
	const dialogRef = useRef<HTMLDialogElement>(null);

	function summarize() {
		if (dialogRef.current === null) {
			return;
		}

		submit(selectedText);
		dialogRef.current.showModal();
	}

	function closeDialog() {
		dialogRef.current?.close();
	}

	return (
		<>
			<Transition
				show={selectedText.length >= 200}
				enter="transition-opacity duration-300"
				enterFrom="opacity-0"
				enterTo="opacity-100"
				leave="transition-opacity duration-300"
				leaveFrom="opacity-100"
				leaveTo="opacity-0"
			>
				<button className="button absolute bottom-4 left-1/2 -translate-x-1/2" onClick={summarize}>
					Summarize
				</button>
			</Transition>
			<dialog
				ref={dialogRef}
				className="relative h-[500px] w-[600px] rounded-xl p-6 pt-16 backdrop:bg-black/50 backdrop:backdrop-blur-sm"
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
					<div aria-live="polite" className="rounded-3xl bg-primary/35 px-5 py-2.5">
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
