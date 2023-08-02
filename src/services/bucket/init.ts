import { mkdir } from "@shopify/cli-kit/node/fs"
import { shopkeeperDirectory } from "../../utilities/constants.js"

export async function init() {
  mkdir(`./${shopkeeperDirectory}`)
}
