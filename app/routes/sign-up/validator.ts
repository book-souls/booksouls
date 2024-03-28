import { custom, email, minLength, object, parse, string } from "valibot";

export const minPasswordLength = 8;

const signUpSchema = object(
	{
		email: string([email()]),
		password: string([minLength(minPasswordLength)]),
		confirmPassword: string(),
	},
	[custom((input) => input.password == input.confirmPassword)],
);

export function validateFormData(formData: FormData) {
	const entries = Object.fromEntries(formData);
	return parse(signUpSchema, entries);
}
