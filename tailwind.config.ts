import type { Config } from "tailwindcss";
// @ts-expect-error No DTS file for this module
import flattenColorPalette from "tailwindcss/lib/util/flattenColorPalette";
import plugin from "tailwindcss/plugin";

const colors = {
	primary: {
		DEFAULT: "#1f5f8b",
		light: "#1891ac",
	},
	background: {
		DEFAULT: "#d2ecf9",
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
	plugins: [
		plugin(({ matchUtilities, theme }) => {
			matchUtilities(
				{
					"scrollbar-thumb-color": (value: string) => {
						return {
							"&::-webkit-scrollbar-thumb": {
								backgroundColor: value,
							},
							"--scrollbar-thumb-color": value,
							"scrollbar-color": "var(--scrollbar-thumb-color) var(--scrollbar-track-color)",
						};
					},
					"scrollbar-track-color": (value: string) => {
						return {
							"&::-webkit-scrollbar-track": {
								backgroundColor: value,
							},
							"--scrollbar-track-color": value,
							"scrollbar-color": "var(--scrollbar-thumb-color) var(--scrollbar-track-color)",
						};
					},
				},
				{
					values: flattenColorPalette(theme("colors")),
				},
			);
		}),
	],
} satisfies Config;
