import logo from "~/assets/logo.svg";

export type LogoProps = {
	scale?: number;
};

export function Logo({ scale = 1 }: LogoProps) {
	return (
		<img
			src={logo}
			alt="Book Souls"
			width={scale * 266}
			height={scale * 75}
			className="select-none"
		/>
	);
}
