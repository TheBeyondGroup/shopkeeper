import { mkdir } from "@shopify/cli-kit/node/fs"
import { renderSuccess } from "@shopify/cli-kit/node/ui"
import { SHOPKEEPER_DIRECTORY } from "../../utilities/constants.js"

export async function init() {
  await mkdir(`./${SHOPKEEPER_DIRECTORY}`)

  renderSuccess({ body: `${SHOPKEEPER_DIRECTORY} directory created.` })
}
