import {Filter, FilterProps, filterThemes} from './theme-selector/filter.js'
import {fetchStoreThemes} from '@shopify/cli'

/**
 * Finds themes in the store.
 *
 * @param session - Current Admin session
 * @param filterProps - The filter ({@link FilterProps}) applied in the list
 *                      of themes in the store
 *
 * @returns a collection of {@link Theme}
 */
export async function findThemes(store: string, password: string, filterProps: FilterProps) {
  const themes = await fetchStoreThemes(store, password)
  const filter = new Filter(filterProps)

  if (filter.any()) {
    return filterThemes(store, themes, filter)
  }

  return []
}
