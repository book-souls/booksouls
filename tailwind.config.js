/** @type {import('tailwindcss').Config} */
export default {
	darkMode: [],
	content: ["./app/**/*.{ts,tsx}"],
	theme: {
		extend: {
			colors: {
				primary: {
					DEFAULT: "#1891ac",
					light: "#d2ecf9",
					dark: "#253b6e",
				},
			},
			fontFamily: {
				sans: ["Poppins", "system-ui", "sans-serif"],
			},
		},
	},
	plugins: [],
};
