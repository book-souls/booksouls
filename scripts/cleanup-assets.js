import fs from "node:fs";
import path from "node:path";

const scriptFiles = fs
	.readdirSync("app", { recursive: true })
	.filter(
		(file) =>
			file.endsWith(".ts") ||
			file.endsWith(".tsx") ||
			file.endsWith(".js") ||
			file.endsWith(".jsx"),
	)
	.map((file) => fs.readFileSync(path.join("app", file), { encoding: "utf-8" }));

const unusedAssets = fs
	.readdirSync(path.join("app", "assets"))
	.filter((asset) => scriptFiles.every((file) => !file.includes(asset)));

for (const asset of unusedAssets) {
	console.log("Deleting", asset);
	fs.rmSync(path.join("app", "assets", asset));
}
