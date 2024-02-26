import React from "react";
import logo from "~/assets/logo.svg";

export type LogoProps = Omit<React.ComponentPropsWithRef<"img">, "src" | "alt">;

export const Logo: React.FC<LogoProps> = React.forwardRef((props, ref) => {
	return <img ref={ref} src={logo} alt="Book Souls logo" width={266} height={75} {...props} />;
});

Logo.displayName = "Logo";
