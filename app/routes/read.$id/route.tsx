import { Link, useLoaderData } from "@remix-run/react";
import epubjs, { Contents, Rendition, type Location } from "epubjs";
import { ChevronLeft, ChevronRight, HomeIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { action } from "./action.server";
import { loader } from "./loader.server";
import { useSummarizer, type Summarizer } from "./use-summarizer";

export { loader, action };

export default function Page() {
	const { title, epubUrl } = useLoaderData<typeof loader>();
	const summarizer = useSummarizer();
	const [atStart, setAtStart] = useState(true);
	const [atEnd, setAtEnd] = useState(false);
	const [showSummarize, setShowSummarize] = useState(false);
	const [dialogOpen, setDialogOpen] = useState(false);
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

		const book = epubjs(epubUrl);
		const rendition = book.renderTo(reader, {
			height: "100%",
			width: "100%",
			allowScriptedContent: true,
			spread: "always",
		});

		renditionRef.current = rendition;
		rendition.display();

		rendition.hooks.content.register((contents: Contents) => {
			contents.document.addEventListener("selectionchange", function () {
				const selection = this.getSelection();
				selectionRef.current = selection;
				setShowSummarize(selection !== null && selection.toString().length >= 500);
			});
		});

		rendition.on("relocated", (location: Location) => {
			setAtStart(location.atStart);
			setAtEnd(location.atEnd);
			clearSelection();
		});

		return () => {
			rendition.destroy();
			renditionRef.current = null;
			clearSelection();
		};
	}, [epubUrl]);

	function goToPrevious() {
		renditionRef.current?.prev();
	}

	function goToNext() {
		renditionRef.current?.next();
	}

	function summarizeSelection() {
		if (summarizer.pending || selectionRef.current === null) {
			return;
		}

		summarizer.summarize(selectionRef.current.toString());
		setDialogOpen(true);
		clearSelection();
	}

	function closeDialog() {
		setDialogOpen(false);
	}

	return (
		<div className="flex h-screen min-h-[600px] w-full items-center justify-center bg-white text-neutral-800">
			<div className="relative h-full max-h-[800px] w-full max-w-[1400px]">
				<header className="absolute top-0 z-10 flex h-12 w-full items-center border-b border-gray-200 px-4 py-2 text-primary">
					<Link to="/" className="icon-button h-8 w-8">
						<HomeIcon className="!size-4" />
					</Link>
					<h1 className="absolute left-1/2 -translate-x-1/2 font-medium leading-tight">{title}</h1>
				</header>
				<div
					ref={readerRef}
					className="relative z-0 h-full w-full rounded-lg p-16 after:absolute after:left-1/2 after:top-1/2 after:h-3/4 after:w-px after:-translate-x-1/2 after:-translate-y-1/2 after:bg-gray-400"
				/>
				<button
					aria-disabled={atStart}
					className="icon-button absolute left-6 top-1/2 -translate-y-1/2"
					onClick={goToPrevious}
				>
					<ChevronLeft />
				</button>
				<button
					aria-disabled={atEnd}
					className="icon-button absolute right-6 top-1/2 -translate-y-1/2"
					onClick={goToNext}
				>
					<ChevronRight />
				</button>
				<button
					aria-hidden={!showSummarize}
					className="absolute bottom-4 left-1/2 flex h-9 -translate-x-1/2 items-center justify-center rounded-md bg-gradient-to-r from-primary to-primary-light px-4 font-medium text-on-primary transition-opacity duration-300 aria-hidden:pointer-events-none aria-hidden:opacity-0"
					onClick={summarizeSelection}
				>
					Summarize
				</button>
			</div>
			<SummaryDialog
				pending={summarizer.pending}
				data={summarizer.data}
				open={dialogOpen}
				onClose={closeDialog}
			/>
		</div>
	);
}

type SummaryDialogProps = {
	pending: boolean;
	data: Summarizer["data"];
	open: boolean;
	onClose: () => void;
};

function SummaryDialog({ pending, data, open, onClose }: SummaryDialogProps) {
	const ref = useRef<HTMLDialogElement>(null);

	useEffect(() => {
		if (ref.current === null) {
			return;
		}

		if (open) {
			ref.current.showModal();
		} else {
			ref.current.close();
		}
	}, [open]);

	return (
		<dialog ref={ref} className="w-[500px] p-6">
			<SummaryDialogContent pending={pending} data={data} />

			{/* eslint-disable-next-line jsx-a11y/no-autofocus */}
			<button autoFocus onClick={onClose} className="mx-auto mt-6 block">
				Close
			</button>
		</dialog>
	);
}

type SummaryDialogContentProps = {
	pending: boolean;
	data: Summarizer["data"];
};

function SummaryDialogContent({ pending, data }: SummaryDialogContentProps) {
	if (pending) {
		return <p>Loading...</p>;
	}

	if (data === undefined) {
		return null;
	}

	const { summary, error } = data;

	if (error) {
		return <p>Error: {error}</p>;
	}

	return <p>Summary: {summary}</p>;
}
