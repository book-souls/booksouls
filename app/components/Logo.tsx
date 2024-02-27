import React from "react";
import logo from "~/assets/logo.svg";

export type LogoProps = Omit<React.ComponentPropsWithoutRef<"img">, "src" | "alt">;

export function Logo({ width = 266, height = 75, ...props }: LogoProps) {
	return <img src={logo} alt="Book Souls logo" width={width} height={height} {...props} />;
}
