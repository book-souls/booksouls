import { createCookie } from "@vercel/remix";
import { safeParse } from "valibot";
import { EmailSchema } from "./validate";

const signInCookie = createCookie("sign-in", {
	maxAge: 60 * 30, // 30 minutes
	httpOnly: true,
	path: "/",
	sameSite: "lax",
	secure: process.env.NODE_ENV === "production",
});

export async function getSignInCookie(request: Request) {
	const cookie = await signInCookie.parse(request.headers.get("Cookie"));
	const parsed = safeParse(EmailSchema, cookie);

	if (!parsed.success) {
		return null;
	}

	return parsed.output;
}

export async function setSignInCookie(headers: Headers, email: string) {
	const cookie = await signInCookie.serialize(email);
	headers.append("Set-Cookie", cookie);
}

export async function deleteSignInCookie(headers: Headers) {
	const cookie = await signInCookie.serialize("", { maxAge: 0 });
	headers.append("Set-Cookie", cookie);
}
