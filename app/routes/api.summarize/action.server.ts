import type { ActionFunctionArgs } from "@vercel/remix";
import { env } from "~/utils/env.server";
import { isObject, isString } from "~/utils/validate";

const SUMMARIZATION_ENDPOINT = env("SUMMARIZATION_ENDPOINT");
const HF_TOKEN = env("HF_TOKEN");

export async function action({ request }: ActionFunctionArgs) {
	try {
		const input = await request.text();
		const summary = await summarize(input);
		return { summary, error: false };
	} catch (error) {
		console.error("Failed to summarize:", error);
		return { summary: null, error: true };
	}
}

async function summarize(text: string, waitForModel: boolean = false) {
	const headers: HeadersInit = {
		"Content-Type": "application/json",
		Authorization: `Bearer ${HF_TOKEN}`,
	};

	if (waitForModel) {
		headers["X-Wait-For-Model"] = "true";
	}

	const response = await fetch(SUMMARIZATION_ENDPOINT, {
		method: "POST",
		body: JSON.stringify({
			inputs: text,
		}),
		headers,
	});

	if (response.ok) {
		const output = await response.json();
		if (!isObject(output) || !isString(output.generated_text)) {
			throw new Error(`Unexpected summarization response: ${JSON.stringify(output)}`);
		}
		return output.generated_text;
	}

	if (response.status === 503) {
		// The model is loading, try again.
		return summarize(text, true);
	}

	throw new Error(`Failed to summarize: ${response.statusText}`);
}
