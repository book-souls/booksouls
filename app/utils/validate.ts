export function isString(value: unknown): value is string {
	return typeof value === "string";
}

export function isEmail(value: unknown): value is string {
	return typeof value === "string" && value.includes("@");
}

export function isDigit(value: unknown): value is string {
	return typeof value === "string" && /^[0-9]$/.test(value);
}

export function isNumber(value: unknown): value is number {
	return typeof value === "number";
}

export function isObject(value: unknown): value is Record<PropertyKey, unknown> {
	return typeof value === "object" && value !== null;
}
