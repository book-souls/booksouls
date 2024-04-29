import { email, string } from "valibot";

export const EmailSchema = string([email()]);
