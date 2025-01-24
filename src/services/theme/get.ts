import {AdminSession} from '@shopify/cli-kit/node/session'
import {Theme} from '@shopify/cli-kit/node/themes/types.js'
import {Filter, filterThemes} from '../../utilities/shopify/theme-selector/filter.js'
import {fetchStoreThemes} from '@shopify/cli'

export async function get(adminSession: AdminSession, theme: string): Promise<Theme[]> {
  let storeThemes = await fetchStoreThemes(adminSession.storeFqdn, adminSession.token)
  const filter = new Filter({theme: theme})

  if (filter.any()) {
    storeThemes = filterThemes(adminSession.storeFqdn, storeThemes, filter)
  }

  return storeThemes
}
