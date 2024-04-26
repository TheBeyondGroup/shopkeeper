#!/usr/bin/env node
import { promises as fs } from "node:fs";
import url from "node:url";
import { findPathUp } from "@shopify/cli-kit/node/fs";

if (process.env["$npm_config_production"]) {
  // We don't patch when the package is installed by the user
  process.exit(0);
}

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const cliPackageJsonPath = await findPathUp("node_modules/@shopify/cli/package.json", { type: "file", cwd: __dirname })
const cliPackageJson = JSON.parse(await fs.readFile(cliPackageJsonPath))
const oclifPlugins = cliPackageJson?.oclif?.plugins ?? [];
if (oclifPlugins.includes("@thebeyondgroup/shopkeeper")) {
  process.exit(0);
}

await fs.writeFile(cliPackageJsonPath, JSON.stringify({
  ...cliPackageJson,
  oclif: {
    ...cliPackageJson.oclif,
    plugins: [
      ...oclifPlugins,
      "@thebeyondgroup/shopkeeper"
    ]
  }
}, null, 2))
