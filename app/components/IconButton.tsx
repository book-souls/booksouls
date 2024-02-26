import React from "react";

export type IconButtonProps = React.ComponentPropsWithRef<"button">;

export const IconButton: React.FC<IconButtonProps> = React.forwardRef((props, ref) => {
	const { className = "", ...rest } = props;
	return (
		<button
			ref={ref}
			className={`
                text-brand-lightest inline-flex h-10 w-10 items-center justify-center rounded-full
				before:absolute before:inset-0 before:rounded-[inherit] before:bg-current before:opacity-0
				hover:before:opacity-[8%]
				active:before:opacity-[12%]
               ${className}
            `}
			{...rest}
		/>
	);
});

IconButton.displayName = "IconButton";
