import { textGeneration } from "@huggingface/inference";
import type { ActionFunctionArgs } from "@vercel/remix";

export async function action({ request }: ActionFunctionArgs) {
	try {
		const input = await request.text();
		const summary = await summarize(input);
		return {
			summary,
			error: false as const,
		};
	} catch (error) {
		console.error("Failed to summarize:", error);
		return {
			summary: null,
			error: true as const,
		};
	}
}

async function summarize(text: string) {
	const { generated_text: summary } = await textGeneration({
		model: "booksouls/long-t5-tglobal-base",
		inputs: text,
		accessToken: process.env.HF_API_KEY,
	});
	return summary;
}
