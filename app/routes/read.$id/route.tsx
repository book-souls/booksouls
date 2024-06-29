import { Transition, TransitionChild } from "@headlessui/react";
import { Link, useLoaderData } from "@remix-run/react";
import * as dialog from "@zag-js/dialog";
import { normalizeProps, Portal, useMachine } from "@zag-js/react";
import epubjs, { Contents, Rendition, type Location } from "epubjs";
import { ChevronLeft, ChevronRight, HomeIcon, Loader2Icon, XIcon } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import BotIcon from "~/assets/bot.svg?react";
import { Typewriter } from "~/components/Typewriter";
import { useSummarizeFetcher, type SummarizeFetcher } from "../api.summarize/use-summarize-fetcher";
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
			}
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
			<header className="fixed left-0 right-0 top-0 z-10 h-12 border-b border-gray-300 text-primary">
				<div className="relative mx-auto flex h-full max-w-7xl items-center justify-center">
					<h1 className="font-medium">{title}</h1>
					<Link to="/" aria-label="Home" className="icon-button absolute left-4 size-8">
						<HomeIcon className="size-4" />
					</Link>
				</div>
			</header>
			<div className="relative z-0 mt-12 h-[calc(100%-3rem)] max-h-[800px] w-full max-w-[1400px]">
				<div className="h-full w-full p-16">
					<div
						ref={readerRef}
						className="relative h-full w-full after:absolute after:left-1/2 after:top-1/2 after:h-[90%] after:w-px after:-translate-x-1/2 after:-translate-y-1/2 after:bg-gray-400"
					/>
				</div>
				{loading && (
					<div className="absolute left-1/4 top-1/2 -translate-x-1/2 -translate-y-1/2">
						<Loader2Icon aria-label="Loading" className="size-10 animate-spin text-primary" />
					</div>
				)}
				<SummarizeButton selectedText={selectedText} />
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
			</div>
		</div>
	);
}

function SummarizeButton({ selectedText }: { selectedText: string }) {
	const id = useId();
	const fetcher = useSummarizeFetcher();
	const [dialogState, send] = useMachine(dialog.machine({ id }));
	const api = dialog.connect(dialogState, send, normalizeProps);
	return (
		<>
			<Transition
				show={selectedText.length >= 500}
				enter="transition-opacity duration-300"
				enterFrom="opacity-0"
				enterTo="opacity-100"
				leave="transition-opacity duration-300"
				leaveFrom="opacity-100"
				leaveTo="opacity-0"
			>
				<fetcher.Form method="post" action="/api/summarize">
					<input type="hidden" name="input" value={selectedText} />
					<button
						{...api.getTriggerProps()}
						type="submit"
						className="button absolute bottom-4 left-1/2 -translate-x-1/2"
					>
						Summarize
					</button>
				</fetcher.Form>
			</Transition>
			<Portal>
				<Transition show={api.open}>
					<TransitionChild
						enter="duration-300 transition-opacity"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="transition-opacity duration-300"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div
							{...api.getBackdropProps()}
							className="fixed inset-0 z-20 !block bg-black/50 backdrop-blur-sm"
						/>
					</TransitionChild>
					<TransitionChild
						enter="motion-safe:transition-transform motion-safe:duration-500 motion-reduce:transition-opacity motion-reduce:duration-300"
						enterFrom="motion-safe:translate-y-full motion-reduce:opacity-0"
						enterTo="motion-safe:translate-y-0 motion-reduce:opacity-100"
						leave="motion-safe:transition-[opacity,transform] motion-safe:duration-500 motion-reduce:transition-opacity motion-reduce:duration-300"
						leaveFrom="opacity-100 motion-safe:scale-100"
						leaveTo="opacity-0 motion-safe:scale-50"
					>
						<div
							{...api.getPositionerProps()}
							className="fixed inset-0 z-20 flex items-center justify-center"
						>
							<div
								{...api.getContentProps()}
								className="relative !block h-full max-h-[500px] w-full max-w-[600px] overflow-y-auto rounded-xl bg-floating p-6 pt-16 text-on-floating"
							>
								<p className="ml-auto w-fit rounded-3xl bg-primary-light/35 px-4 py-2 text-sm">
									Summarize the highlighted text
								</p>
								<div className="flex gap-4 pt-6">
									<BotIcon role="img" aria-label="Chatbot" className="size-9 shrink-0" />
									<div aria-live="polite" className="rounded-3xl bg-primary/35 px-4 py-2 text-sm">
										<ChatbotMessage state={fetcher.state} data={fetcher.data} />
									</div>
								</div>
								<button
									{...api.getCloseTriggerProps()}
									aria-label="Close dialog"
									className="icon-button absolute right-3 top-3 size-8"
								>
									<XIcon className="size-5" />
								</button>
							</div>
						</div>
					</TransitionChild>
				</Transition>
			</Portal>
		</>
	);
}

function ChatbotMessage({ state, data }: Pick<SummarizeFetcher, "state" | "data">) {
	if (state === "submitting") {
		return <LoadingDots />;
	}

	if (data?.error === true) {
		return <Typing text="Failed to summarize. Please try again later." />;
	}

	if (data?.summary != null) {
		return <Typing text={data.summary} />;
	}

	return null;
}

function LoadingDots() {
	return (
		<svg width={40} height={20} aria-label="Loading" className="translate-y-[12.5%]">
			<circle r="4.5" cx="4.5" cy="50%" className="animate-bounce [animation-duration:900ms]" />
			<circle
				r="4.5"
				cx="50%"
				cy="50%"
				className="animate-bounce [animation-delay:150ms] [animation-duration:900ms]"
			/>
			<circle
				r="4.5"
				cx="35.5"
				cy="50%"
				className="animate-bounce [animation-delay:300ms] [animation-duration:900ms]"
			/>
		</svg>
	);
}

function Typing({ text }: { text: string }) {
	return (
		<Typewriter tag="p" duration={text.length * 15}>
			{text}
		</Typewriter>
	);
}
