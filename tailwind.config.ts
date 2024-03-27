import type { Config } from "tailwindcss";
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
		plugin(({ addComponents, addUtilities }) => {
			addComponents({
				".line-gradient": {
					height: "16px",
					width: "100%",
					background: `linear-gradient(
						90deg,
						#1f5f70 0%,
						#007882 12.41%,
						#089f8f 33.33%,
						#10989e 50%,
						#1891ac 66.67%,
						#1c759a 83.33%
					)`,
					backgroundSize: "400% 400%",
					animation: "line-gradient 10s ease infinite",
				},
				"@keyframes line-gradient": {
					"0%": {
						backgroundPosition: "0% 50%",
					},
					"50%": {
						backgroundPosition: "100% 50%",
					},
					"100%": {
						backgroundPosition: "0% 50%",
					},
				},
			});

			addUtilities({
				".scrollbar-hidden": {
					"&::-webkit-scrollbar": {
						display: "none",
					},
					// Firefox
					scrollbarWidth: "none",
				},
			});
		}),
	],
} satisfies Config;
