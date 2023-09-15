import { pluralize } from "@shopify/cli-kit/common/string"
import { renderSuccess } from "@shopify/cli-kit/node/ui"
import { createBuckets } from "../../utilities/bucket.js"

export async function create(buckets: string[]) {
  await createBuckets(buckets)

  renderSuccess({
    body: pluralize(
      buckets,
      (buckets) => ['The following buckets were added:', { list: { items: buckets } }],
      (bucket) => [`${bucket} was created.`]
    )
  })
}

