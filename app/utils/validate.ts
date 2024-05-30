export function isString(value: unknown): value is string {
	return typeof value === "string";
}

export function isEmail(value: unknown): value is string {
	return typeof value === "string" && value.includes("@");
}

export function isDigit(value: unknown): value is string {
	return typeof value === "string" && /^[0-9]$/.test(value);
}
