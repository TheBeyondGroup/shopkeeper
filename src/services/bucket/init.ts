import { appendFile, fileExists, mkdir, writeFile } from '@shopify/cli-kit/node/fs'
import { joinPath } from '@shopify/cli-kit/node/path'
import { renderSuccess } from '@shopify/cli-kit/node/ui'
import { createBuckets, getShopkeeperPath } from '../../utilities/bucket.js'
import { SHOPKEEPER_DIRECTORY } from '../../utilities/constants.js'

export async function init(buckets: string[], cwd?: string) {
  const projectRoot = cwd || '.'
  await mkdir(joinPath(projectRoot, SHOPKEEPER_DIRECTORY))
  const shopkeeperRoot = await getShopkeeperPath(projectRoot)

  let action = ''
  const gitIgnorePath = joinPath(projectRoot, '.gitignore')
  if (await fileExists(gitIgnorePath)) {
    await appendFile(gitIgnorePath, '\n\n' + DEFAULT_GITIGNORE_FILE)
    action = 'updated'
  } else {
    await writeFile(gitIgnorePath, DEFAULT_GITIGNORE_FILE)
    action = 'created'
  }

  await createBuckets(shopkeeperRoot, buckets)

  renderSuccess({
    headline: 'Shopkeeper initialized',
    body: {
      list: {
        items: [`${SHOPKEEPER_DIRECTORY} directory created`, `.gitignore ${action}`],
      },
    },
    customSections: renderBucketListSection(buckets),
  })
}

function renderBucketListSection(buckets: string[]) {
  if (buckets.length) {
    return [
      {
        title: 'Buckets created:',
        body: {
          list: {
            items: buckets,
          },
        },
      },
    ]
  } else {
    return []
  }
}

export const DEFAULT_GITIGNORE_FILE = `# Shopkeeper #
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
