import { mkdir } from "@shopify/cli-kit/node/fs"

export async function init() {
  mkdir("./.shopkeeper")
}

