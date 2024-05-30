export function bookNotFound() {
	return new Response("Book not found", {
		status: 404,
	});
}
