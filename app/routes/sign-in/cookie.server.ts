import { createCookie } from "@vercel/remix";

const emailCookie = createCookie("sign-in-email", {
	maxAge: 60 * 30, // 30 minutes
	httpOnly: true,
	path: "/",
	sameSite: "lax",
	secure: process.env.NODE_ENV === "production",
});

export function getEmailCookie(headers: Headers) {
	return emailCookie.parse(headers.get("Cookie"));
}

export async function setEmailCookie(headers: Headers, email: string) {
	const cookie = await emailCookie.serialize(email);
	headers.append("Set-Cookie", cookie);
}

export async function deleteEmailCookie(headers: Headers) {
	const cookie = await emailCookie.serialize("", { maxAge: 0 });
	headers.append("Set-Cookie", cookie);
}
