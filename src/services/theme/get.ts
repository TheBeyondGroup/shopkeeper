import { AdminSession } from "@shopify/cli-kit/node/session";
import { Theme } from "@shopify/cli-kit/node/themes/types.js";
import { fetchStoreThemes } from "@shopify/theme/dist/cli/utilities/theme-selector/fetch.js";
import { Filter, filterThemes } from "@shopify/theme/dist/cli/utilities/theme-selector/filter.js";

export async function get(adminSession: AdminSession, theme: string): Promise<Theme[]> {
  let storeThemes = await fetchStoreThemes(adminSession)
  const filter = new Filter({ theme: theme })

  if (filter.any()) {
    storeThemes = filterThemes(adminSession.storeFqdn, storeThemes, filter)
  }

  return storeThemes
}
