import useEmblaCarousel from "embla-carousel-react";
import React from "react";

export type UseCarouselArgs = Parameters<typeof useEmblaCarousel>;

export function useCarousel(...args: UseCarouselArgs) {
	const [ref, carousel] = useEmblaCarousel(...args);
	const [index, setIndex] = React.useState(0);

	React.useEffect(() => {
		if (!carousel) {
			return;
		}

		type Carousel = NonNullable<typeof carousel>;
		function onSelect(carousel: Carousel) {
			setIndex(carousel.selectedScrollSnap());
		}

		carousel.on("select", onSelect);
		return () => {
			carousel.off("select", onSelect);
		};
	}, [carousel]);

	return [ref, carousel, index] as const;
}
