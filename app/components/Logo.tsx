import React from "react";
import logo from "~/assets/logo.svg";

export interface LogoProps extends React.ComponentPropsWithoutRef<"img"> {
	scale?: number;
}

export function Logo({ scale = 1, ...props }: LogoProps) {
	return <img src={logo} alt="Book Souls" width={scale * 266} height={scale * 75} {...props} />;
}
