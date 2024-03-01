import {appendFile, fileExists, mkdir, writeFile} from '@shopify/cli-kit/node/fs'
import {joinPath} from '@shopify/cli-kit/node/path'
import {renderSuccess} from '@shopify/cli-kit/node/ui'
import {createBuckets} from '../../utilities/bucket.js'
import {SHOPKEEPER_DIRECTORY} from '../../utilities/constants.js'

export async function init(buckets: string[]) {
  await mkdir(joinPath('.', SHOPKEEPER_DIRECTORY))

  let action = ''
  const gitIgnorePath = joinPath('.', '.gitignore')
  if (await fileExists(gitIgnorePath)) {
    await appendFile(gitIgnorePath, DEFAULT_GITIGNORE_FILE)
    action = 'updated'
  } else {
    await writeFile(gitIgnorePath, DEFAULT_GITIGNORE_FILE)
    action = 'created'
  }

  await createBuckets(buckets)

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

const DEFAULT_GITIGNORE_FILE = `# Shopkeeper #
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
