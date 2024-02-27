import React from "react";
import logo from "~/assets/logo.svg";

export interface LogoProps
	extends Omit<React.ComponentPropsWithoutRef<"img">, "src" | "alt" | "width" | "height"> {
	scale?: number;
}

export function Logo({ scale = 1, ...props }: LogoProps) {
	return (
		<img src={logo} alt="Book Souls logo" width={scale * 266} height={scale * 75} {...props} />
	);
}
