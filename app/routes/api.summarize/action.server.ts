import { textGeneration } from "@huggingface/inference";
import type { ActionFunctionArgs } from "@vercel/remix";

export async function action({ request }: ActionFunctionArgs) {
	try {
		const input = await request.text();
		const { generated_text: summary } = await textGeneration({
			model: "booksouls/long-t5-tglobal-base",
			inputs: input,
			accessToken: process.env.HF_API_KEY,
		});
		return { summary, error: false };
	} catch (error) {
		console.error("Failed to summarize:", error);
		return { summary: null, error: true };
	}
}
