import { mkdir } from "@shopify/cli-kit/node/fs"
import { SHOPKEEPER_DIRECTORY } from "../../utilities/constants.js"

export async function init() {
  mkdir(`./${SHOPKEEPER_DIRECTORY}`)
}
