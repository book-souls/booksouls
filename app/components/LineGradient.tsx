import "./LineGradient.css";
import React from "react";

export type LineGradientProps = React.ComponentPropsWithoutRef<"div">;

export function LineGradient({ className = "", ...props }: LineGradientProps) {
	return <div className={`line-gradient ${className}`} {...props} />;
}
