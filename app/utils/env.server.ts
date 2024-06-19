export function env(name: string): string {
	const value = process.env[name];
	if (value === undefined) {
		throw new Error(`Missing ${name} environment variable`);
	}
	return value;
}
