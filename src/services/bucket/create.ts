import { pluralize } from "@shopify/cli-kit/common/string"
import { mkdir, writeFile } from "@shopify/cli-kit/node/fs"
import { renderSuccess } from "@shopify/cli-kit/node/ui"
import { getBucketPath } from "../../utilities/bucket.js"

export async function create(buckets: string[]) {
  await Promise.all(buckets.map(async bucket => {
    const bucketPath = await getBucketPath(bucket)
    await mkdir(bucketPath)
    await writeFile(`${bucketPath}/.env`, envContent())
    await writeFile(`${bucketPath}/.env.sample`, envContent())
    await mkdir(`${bucketPath}/config`)
    await mkdir(`${bucketPath}/templates`)
    await mkdir(`${bucketPath}/sections`)
  }))
  renderSuccess({
    body: pluralize(
      buckets,
      (buckets) => ['The following buckets were added:', { list: { items: buckets } }],
      (bucket) => [`${bucket} was created.`]
    )
  })

}

function envContent() {
  return [
    "SHOPIFY_CLI_THEME_TOKEN=<Theme Access token>",
    "SHOPIFY_FLAG_STORE=<Shopify store url>",
    "SHOPIFY_FLAG_PATH=<path to folder containing theme>",
    "# Set these flags if you're using the blue/green strategy",
    "# SKR_FLAG_GREEN_THEME_ID=<theme ID>",
    "# SKR_FLAG_BLUE_THEME_ID=<theme ID>"
  ].join("\n")
}
