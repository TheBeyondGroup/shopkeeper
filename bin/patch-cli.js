#!/usr/bin/env node
import { promises as fs } from "node:fs";
import path from "node:path";
import url from "node:url";

if (process.env["$npm_config_production"]) {
    // We don't patch when the package is installed by the user
    process.exit(0);
}

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const cliPackageJsonPath = path.join(__dirname, "../node_modules/@shopify/cli/package.json")
const cliPackageJson = JSON.parse(await fs.readFile(cliPackageJsonPath))
if (cliPackageJson.oclif.plugins.includes("shopkeeper")) {
    process.exit(0);
}

await fs.writeFile(cliPackageJsonPath, JSON.stringify({
    ...cliPackageJson,
    oclif: {
        ...cliPackageJson.oclif,
        plugins: [
            ...cliPackageJson.oclif.plugins,
            "shopkeeper"
        ]
    }
}, null, 2))
