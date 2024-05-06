import "@fontsource/poppins/100.css";
import "@fontsource/poppins/300.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "./root.css";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";
import type { MetaFunction } from "@vercel/remix";
import { Toaster } from "sonner";

export const config = { runtime: "edge" };

export const meta: MetaFunction = () => {
	return [
		{ title: "Book Souls" },
		{
			name: "description",
			content:
				"Book Souls is a book platform that aims to bridge the literary gap with AI-powered summarization and recommendation features.",
		},
	];
};

export default function App() {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body>
				<Outlet />
				<ScrollRestoration />
				<Scripts />
				<Toaster richColors closeButton />
			</body>
		</html>
	);
}
