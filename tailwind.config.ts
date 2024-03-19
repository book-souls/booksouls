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
	scrollbar: "#bde3f6",
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
		plugin(({ addBase, matchUtilities, theme }) => {
			addBase({
				"*": {
					scrollbarColor: "var(--scrollbar-thumb-color, auto) var(--scrollbar-track-color, auto)",
				},
			});

			matchUtilities(
				{
					"scrollbar-thumb-color": (value: string) => {
						return {
							"--scrollbar-thumb-color": value,
						};
					},
					"scrollbar-track-color": (value: string) => {
						return {
							"--scrollbar-track-color": value,
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
