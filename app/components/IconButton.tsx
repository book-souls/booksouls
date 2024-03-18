import React from "react";
import { twMerge } from "tailwind-merge";

export type IconButtonProps = React.ComponentPropsWithRef<"button">;

export const IconButton: React.FC<IconButtonProps> = React.forwardRef(
	({ className, ...props }, ref) => (
		<button
			ref={ref}
			className={twMerge(
				"relative inline-flex h-10 w-10 items-center justify-center rounded-full",
				"before:absolute before:inset-0 before:rounded-[inherit] before:bg-current before:opacity-0",
				"hover:before:opacity-10",
				"focus-visible:outline focus-visible:outline-2 focus-visible:outline-current",
				"active:before:opacity-15",
				"disabled:pointer-events-none disabled:opacity-50",
				className,
			)}
			{...props}
		/>
	),
);

IconButton.displayName = "IconButton";
