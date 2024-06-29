import { textGeneration } from "@huggingface/inference";
import { json, type ActionFunctionArgs } from "@vercel/remix";
import { HF_TOKEN } from "~/utils/env.server";
import { isString } from "~/utils/validate";

export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData();
	const input = formData.get("input");

	if (!isString(input)) {
		throw new Response("Invalid input", { status: 400 });
	}

	try {
		const { generated_text: summary } = await textGeneration({
			model: "booksouls/bart-large-cnn",
			inputs: input,
			accessToken: HF_TOKEN,
		});
		return json({
			summary,
			error: false,
		});
	} catch (error) {
		console.error("Failed to summarize:", error);
		return json(
			{
				summary: null,
				error: true,
			},
			{ status: 500 },
		);
	}
}
