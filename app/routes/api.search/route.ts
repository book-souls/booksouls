export { action } from "./action.server";

// Model startup time can be *really* long.
export const config = {
	runtime: "nodejs",
	maxDuration: 60,
};
