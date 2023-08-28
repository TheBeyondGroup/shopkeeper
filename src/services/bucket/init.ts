import { appendFile, fileExists, mkdir, writeFile } from "@shopify/cli-kit/node/fs"
import { renderSuccess } from "@shopify/cli-kit/node/ui"
import { SHOPKEEPER_DIRECTORY } from "../../utilities/constants.js"

export async function init() {
  await mkdir(`./${SHOPKEEPER_DIRECTORY}`)

  let action = ""
  if (await fileExists('./.gitignore')) {
    await appendFile('./.gitignore', gitIgnoreContent)
    action = "updated"
  } else {
    await writeFile('./.gitignore', gitIgnoreContent)
    action = "created"
  }
  renderSuccess({
    body: {
      list:
      {
        items: [
          `${SHOPKEEPER_DIRECTORY} directory created`,
          `.gitignore ${action}`
        ]
      }
    }
  })
}

const gitIgnoreContent = `# Shopkeeper #
##########
.shopkeeper/**/**/.env
.shopkeeper/.current-bucket
.env

# Theme #
##########
theme/assets
theme/config/settings_data.json
theme/templates/**/*.json
theme/sections/*.json
`
