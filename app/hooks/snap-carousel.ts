import { useCallback, useState } from "react";
import { useSnapCarousel as _useSnapCarousel } from "react-snap-carousel";

function getInitialPages(slides: number, slidesPerPage: number) {
	const pages: number[][] = Array(Math.ceil(slides / slidesPerPage));

	let currentIndex = 0;
	for (let i = 0; i < pages.length; ++i) {
		const page: number[] = Array(Math.min(slidesPerPage, slides - currentIndex));
		for (let j = 0; j < page.length; ++j) {
			page[j] = currentIndex;
			currentIndex++;
		}
		pages[i] = page;
	}

	return pages;
}

function prefersReducedMotion() {
	return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export type SnapCarouselProps = {
	slides: number;
	slidesPerPage: number;
	axis?: "x" | "y";
};

export function useSnapCarousel({ slides, slidesPerPage, axis }: SnapCarouselProps) {
	const [initialPages] = useState(() => getInitialPages(slides, slidesPerPage));
	const { pages, activePageIndex, prev, next, ...carousel } = _useSnapCarousel({
		initialPages,
		axis,
	});

	const slideHidden = useCallback(
		(index: number) => {
			const endIndex = Math.min(activePageIndex * slidesPerPage + slidesPerPage, slides);
			const startIndex = Math.max(endIndex - slidesPerPage, 0);
			return index < startIndex || index >= endIndex;
		},
		[activePageIndex, slides, slidesPerPage],
	);

	const scrollPrev = useCallback(() => {
		prev({
			behavior: prefersReducedMotion() ? "instant" : "smooth",
		});
	}, [prev]);

	const scrollNext = useCallback(() => {
		next({
			behavior: prefersReducedMotion() ? "instant" : "smooth",
		});
	}, [next]);

	return Object.assign(carousel, {
		pages,
		activePageIndex,
		scrollPrev,
		scrollNext,
		slideHidden,
	});
}
