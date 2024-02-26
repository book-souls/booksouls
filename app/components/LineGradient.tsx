import "./LineGradient.css";
import React from "react";

export type LineGradientProps = React.ComponentPropsWithRef<"div">;

export const LineGradient: React.FC<LineGradientProps> = React.forwardRef((props, ref) => {
	const { className = "", ...rest } = props;
	return <div ref={ref} className={`line-gradient ${className}`} {...rest} />;
});

LineGradient.displayName = "LineGradient";
