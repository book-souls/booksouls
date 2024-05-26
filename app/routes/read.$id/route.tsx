import { useLoaderData } from "@remix-run/react";
import epubjs, { Contents, Rendition, type Location } from "epubjs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { action } from "./action.server";
import { loader } from "./loader.server";
import { useSummarizer, type Summarizer } from "./use-summarizer";

export { loader, action };

export default function Page() {
	const { epubUrl } = useLoaderData<typeof loader>();
	const summarizer = useSummarizer();
	const [atStart, setAtStart] = useState(true);
	const [atEnd, setAtEnd] = useState(false);
	const [summarizeShown, setSummarizeShown] = useState(false);
	const [dialogOpen, setDialogOpen] = useState(false);
	const readerRef = useRef<HTMLDivElement>(null);
	const renditionRef = useRef<Rendition | null>(null);
	const selectionRef = useRef<Selection | null>(null);

	function clearSelection() {
		selectionRef.current?.empty();
		selectionRef.current = null;
		setSummarizeShown(false);
	}

	useEffect(() => {
		const readerEl = readerRef.current;
		if (readerEl === null) {
			return;
		}

		const book = epubjs(epubUrl);
		const rendition = book.renderTo(readerEl, {
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
				setSummarizeShown(selection !== null && selection.toString().length >= 500);
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
		<>
			<div className="flex h-screen items-center justify-center gap-5 p-8">
				<button disabled={atStart} className="icon-button" onClick={goToPrevious}>
					<ChevronLeft />
				</button>
				<div
					ref={readerRef}
					className="relative h-[500px] w-[1050px] rounded-lg border bg-white after:absolute after:left-1/2 after:top-0 after:my-8 after:h-[90%] after:w-px after:-translate-x-1/2 after:bg-gray-400"
				>
					<button
						aria-hidden={!summarizeShown}
						className="absolute -bottom-4 left-1/2 flex h-9 -translate-x-1/2 translate-y-full items-center justify-center rounded-md bg-gradient-to-r from-primary to-primary-light px-4 font-medium text-on-primary transition-opacity duration-300 aria-hidden:opacity-0"
						onClick={summarizeSelection}
					>
						Summarize
					</button>
				</div>
				<button disabled={atEnd} className="icon-button" onClick={goToNext}>
					<ChevronRight />
				</button>
			</div>
			<SummaryDialog
				pending={summarizer.pending}
				data={summarizer.data}
				open={dialogOpen}
				onClose={closeDialog}
			/>
		</>
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
