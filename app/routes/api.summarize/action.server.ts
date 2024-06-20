import { json, type ActionFunctionArgs } from "@vercel/remix";
import { env } from "~/utils/env.server";
import { isObject, isString } from "~/utils/validate";

const SUMMARIZATION_ENDPOINT = env("SUMMARIZATION_ENDPOINT");
const HF_TOKEN = env("HF_TOKEN");

export async function action({ request }: ActionFunctionArgs) {
	try {
		const input = await request.text();
		// If the cold start takes more than 30 seconds, just abort
		// the request to avoid Vercel Function timeout errors.
		const signal = AbortSignal.timeout(30_000);
		return summarize(input, signal);
	} catch (error) {
		if (error instanceof Error && error.name === "AbortError") {
			console.error("Summarization request timed out");
			return errorResponse(503);
		} else {
			console.error("Failed to summarize:", error);
			return errorResponse(500);
		}
	}
}

async function summarize(input: string, signal: AbortSignal, wait: boolean = false) {
	const headers: HeadersInit = {
		"Content-Type": "application/json",
		Authorization: `Bearer ${HF_TOKEN}`,
	};

	if (wait) {
		headers["X-Wait-For-Model"] = "true";
	}

	const response = await fetch(SUMMARIZATION_ENDPOINT, {
		method: "POST",
		body: JSON.stringify({
			inputs: input,
		}),
		headers,
	});

	if (response.status === 503) {
		// The model is loading from a cold start.
		// Make another request and wait for it to be ready.
		return summarize(input, signal, true);
	}

	if (!response.ok) {
		console.error(`Failed to summarize: ${response.statusText}`);
		return errorResponse(response.status, response.statusText);
	}

	const output: unknown = await response.json();
	if (!isObject(output) || !isString(output.generated_text)) {
		console.error(`Unexpected summarization response: ${JSON.stringify(output)}`);
		return errorResponse(500);
	}

	return summaryResponse(output.generated_text);
}

function errorResponse(status: number, statusText?: string) {
	return json(
		{
			summary: null,
			error: true as const,
			timeout: status === 503,
		},
		{ status, statusText },
	);
}

function summaryResponse(summary: string) {
	return {
		summary,
		error: false as const,
		timeout: false,
	};
}
