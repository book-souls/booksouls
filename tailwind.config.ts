import type { Config } from "tailwindcss";

const colors = {
	primary: {
		DEFAULT: "#1f5f8b",
		light: "#1891ac",
	},
	background: {
		DEFAULT: "#d2ecf9",
		scrollbar: "#a9daf3",
	},
	surface: "#253b6e",
};

export default {
	darkMode: [],
	content: ["./app/**/*.{ts,tsx}"],
	theme: {
		extend: {
			colors: {
				...colors,
				on: {
					primary: colors.background,
					background: colors.primary.DEFAULT,
					surface: colors.background,
				},
			},
			fontFamily: {
				sans: ["Poppins", "system-ui", "sans-serif"],
			},
		},
	},
	plugins: [],
} satisfies Config;
