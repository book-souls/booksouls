export { action } from "./action.server";

// Edge Runtime has a timeout of 25 seconds.
// Model cold start can cause timeout errors in production.
export const config = {
	runtime: "nodejs",
	maxDuration: 60,
};
