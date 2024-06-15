import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";
import plugin from "tailwindcss/plugin";

const palette = {
	primary: {
		DEFAULT: "#1f5f8b",
		light: "#1891ac",
	},
	background: "#d2ecf9",
	surface: "#253b6e",
};

export default {
	darkMode: [],
	content: ["./app/**/*.{ts,tsx}"],
	theme: {
		extend: {
			colors: {
				...palette,
				floating: colors.neutral[50],
				on: {
					primary: palette.background,
					background: palette.primary.DEFAULT,
					surface: palette.background,
					floating: colors.neutral[950],
				},
			},
			fontFamily: {
				sans: ["Poppins", "system-ui", "sans-serif"],
			},
		},
	},
	plugins: [
		plugin(({ addComponents, addUtilities, theme }) => {
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

			addComponents({
				".icon-button": {
					position: "relative",
					display: "inline-flex",
					alignItems: "center",
					justifyContent: "center",
					width: "2.5rem",
					height: "2.5rem",
					borderRadius: "9999px",
					"& :where(svg)": {
						width: "1.5rem",
						height: "1.5rem",
					},
					"&::before": {
						content: "''",
						position: "absolute",
						inset: "0",
						borderRadius: "inherit",
						backgroundColor: "currentColor",
						opacity: "0",
					},
					"&:hover::before": {
						opacity: "0.1",
					},
					"&:active::before": {
						opacity: "0.15",
					},
					"&:focus-visible": {
						outline: "2px solid currentColor",
					},
					"&:disabled, &[aria-disabled='true']": {
						pointerEvents: "none",
						opacity: "0.5",
					},
				},
			});

			addComponents({
				".button": {
					position: "relative",
					display: "inline-flex",
					alignItems: "center",
					justifyContent: "center",
					gap: "0.5rem",
					height: "2.75rem",
					padding: "0 1.5rem",
					borderRadius: theme("borderRadius.lg"),
					backgroundImage: `linear-gradient(to right, ${theme("colors.primary.DEFAULT")}, ${theme("colors.primary.light")})`,
					color: theme("colors.on.primary"),
					"& :where(svg)": {
						width: "1.125rem",
						height: "1.125rem",
					},
					"&::before": {
						content: "''",
						position: "absolute",
						inset: "0",
						borderRadius: "inherit",
						backgroundColor: "currentColor",
						opacity: "0",
					},
					"&:hover::before": {
						opacity: "0.1",
					},
					"&:active::before": {
						opacity: "0.15",
					},
					"&:focus-visible": {
						outline: `2px solid ${theme("colors.primary.DEFAULT")}`,
						outlineOffset: "2px",
					},
				},
			});

			addUtilities({
				".scrollbar-hidden": {
					"&::-webkit-scrollbar": {
						display: "none",
					},
					// Firefox doesn't support -webkit-scrollbar.
					scrollbarWidth: "none",
				},
			});
		}),
	],
} satisfies Config;
