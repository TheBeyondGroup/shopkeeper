import {AdminSession} from '@shopify/cli-kit/node/session'
import {adminRequest} from '@shopify/cli-kit/node/api/admin'

// Theme-scoped translatable resource types. Translations registered against
// these are keyed to a specific theme GID and do not migrate between themes,
// which is why a blue/green deploy strands them on the previously-live theme
// unless something explicitly mirrors them across.
export const THEME_RESOURCE_TYPES = [
  'ONLINE_STORE_THEME',
  'ONLINE_STORE_THEME_APP_EMBED',
  'ONLINE_STORE_THEME_JSON_TEMPLATE',
  'ONLINE_STORE_THEME_LOCALE_CONTENT',
  'ONLINE_STORE_THEME_SECTION_GROUP',
  'ONLINE_STORE_THEME_SETTINGS_CATEGORY',
  'ONLINE_STORE_THEME_SETTINGS_DATA_SECTIONS',
] as const

export type ThemeResourceType = (typeof THEME_RESOURCE_TYPES)[number]

export interface TranslatableContent {
  key: string
  digest: string
  locale: string
}

export interface Translation {
  key: string
  value: string
  locale: string
  outdated?: boolean
}

export interface TranslatableResource {
  resourceId: string
  translatableContent: TranslatableContent[]
  translations: Translation[]
}

interface TranslationInput {
  key: string
  value: string
  locale: string
  translatableContentDigest: string
}

const LIST_BY_TYPE_IDS = `
  query Resources($type: TranslatableResourceType!, $cursor: String) {
    translatableResources(first: 250, after: $cursor, resourceType: $type) {
      edges { cursor node { resourceId } }
      pageInfo { hasNextPage endCursor }
    }
  }
`

// Richer variant — returns content + translations for each resource in the
// same pagination. Used when the source theme IS the live theme, which lets
// us skip per-resource source fetches in the standard recurring deploy case.
const LIST_BY_TYPE_FULL = `
  query ResourcesFull($type: TranslatableResourceType!, $cursor: String, $locale: String!) {
    translatableResources(first: 100, after: $cursor, resourceType: $type) {
      edges {
        cursor
        node {
          resourceId
          translatableContent { key digest locale }
          translations(locale: $locale) { key value locale outdated }
        }
      }
      pageInfo { hasNextPage endCursor }
    }
  }
`

const FETCH_ONE = `
  query Resource($id: ID!, $locale: String!) {
    translatableResource(resourceId: $id) {
      resourceId
      translatableContent { key digest locale }
      translations(locale: $locale) { key value locale outdated }
    }
  }
`

const REGISTER = `
  mutation Register($resourceId: ID!, $translations: [TranslationInput!]!) {
    translationsRegister(resourceId: $resourceId, translations: $translations) {
      userErrors { field message code }
      translations { key value locale }
    }
  }
`

const SHOP_LOCALES = `
  query { shopLocales { locale primary published } }
`

export async function publishedNonPrimaryLocales(session: AdminSession): Promise<string[]> {
  const data = await adminRequest<{shopLocales: Array<{locale: string; primary: boolean; published: boolean}>}>(
    SHOP_LOCALES,
    session,
  )
  return data.shopLocales.filter((l) => l.published && !l.primary).map((l) => l.locale)
}

// Resource IDs come in two shapes:
//   gid://shopify/OnlineStoreTheme/<id>                       (theme metadata)
//   gid://shopify/OnlineStoreThemeLocaleContent/<id>          (path-embedded)
//   gid://shopify/OnlineStoreThemeSettingsDataSections/<id>   (path-embedded)
//   gid://shopify/OnlineStoreThemeJsonTemplate/<x>?theme_id=<id>   (query-param)
//   gid://shopify/OnlineStoreThemeSectionGroup/<x>?theme_id=<id>   (query-param)
//   gid://shopify/OnlineStoreThemeSettingsCategory/<x>?theme_id=<id>&first_setting_id=<...>
//   gid://shopify/OnlineStoreThemeAppEmbed/<x>?theme_id=<id>       (query-param)
export function swapThemeIdInResourceId(rid: string, fromId: string, toId: string): string {
  if (rid.includes(`theme_id=${fromId}`)) {
    return rid.replace(`theme_id=${fromId}`, `theme_id=${toId}`)
  }
  if (rid.endsWith(`/${fromId}`)) {
    return rid.slice(0, -fromId.length) + toId
  }
  throw new Error(`Cannot remap resourceId ${rid} from theme ${fromId} to ${toId}`)
}

export function extractThemeIdFromResourceId(rid: string): string | null {
  const q = rid.match(/theme_id=(\d+)/)
  if (q) return q[1]!
  const p = rid.match(/^gid:\/\/shopify\/OnlineStoreTheme(?:LocaleContent|SettingsDataSections)?\/(\d+)$/)
  if (p) return p[1]!
  return null
}

// Enumerates the universe of theme-scoped translatable resource IDs for the
// given theme. We list via `translatableResources(resourceType: ...)` (which
// returns the LIVE theme's resources) and swap the embedded theme_id to the
// requested theme so we can address resources on either color regardless of
// which is currently published.
interface ListByTypeIdsResponse {
  translatableResources: {
    edges: Array<{cursor: string; node: {resourceId: string}}>
    pageInfo: {hasNextPage: boolean; endCursor: string | null}
  }
}

interface ListByTypeFullResponse {
  translatableResources: {
    edges: Array<{
      cursor: string
      node: {
        resourceId: string
        translatableContent: TranslatableContent[]
        translations: Translation[]
      }
    }>
    pageInfo: {hasNextPage: boolean; endCursor: string | null}
  }
}

export async function listThemeResources(
  session: AdminSession,
  themeId: string,
): Promise<Array<{resourceType: ThemeResourceType; resourceId: string}>> {
  const out: Array<{resourceType: ThemeResourceType; resourceId: string}> = []
  for (const resourceType of THEME_RESOURCE_TYPES) {
    let cursor: string | null = null
    const rids = new Set<string>()
    while (true) {
      const data: ListByTypeIdsResponse = await adminRequest<ListByTypeIdsResponse>(LIST_BY_TYPE_IDS, session, {
        type: resourceType,
        cursor,
      })
      for (const e of data.translatableResources.edges) {
        const liveThemeId = extractThemeIdFromResourceId(e.node.resourceId)
        if (!liveThemeId) continue
        try {
          rids.add(swapThemeIdInResourceId(e.node.resourceId, liveThemeId, themeId))
        } catch {
          // unmappable IDs (shouldn't happen for known types) — skip
        }
      }
      if (!data.translatableResources.pageInfo.hasNextPage) break
      cursor = data.translatableResources.pageInfo.endCursor
    }
    // ONLINE_STORE_THEME returns every theme in the shop, not just the live one,
    // so the enumeration above yields one entry per theme. Constrain to the
    // requested theme directly.
    if (resourceType === 'ONLINE_STORE_THEME') {
      rids.clear()
      rids.add(`gid://shopify/OnlineStoreTheme/${themeId}`)
    }
    for (const resourceId of rids) {
      out.push({resourceType, resourceId})
    }
  }
  return out
}

// Pulls full content + translations for every theme-scoped resource on the
// LIVE theme in one paginated walk per resource type. Used when source = live;
// avoids a per-resource source-fetch round-trip.
export async function listLiveThemeResourcesWithContent(
  session: AdminSession,
  locale: string,
  filterType?: ThemeResourceType,
): Promise<Array<{resourceType: ThemeResourceType; resource: TranslatableResource}>> {
  const out: Array<{resourceType: ThemeResourceType; resource: TranslatableResource}> = []
  const types = filterType ? [filterType] : THEME_RESOURCE_TYPES
  for (const resourceType of types) {
    let cursor: string | null = null
    while (true) {
      const data: ListByTypeFullResponse = await adminRequest<ListByTypeFullResponse>(LIST_BY_TYPE_FULL, session, {
        type: resourceType,
        cursor,
        locale,
      })
      for (const e of data.translatableResources.edges) {
        out.push({resourceType, resource: e.node})
      }
      if (!data.translatableResources.pageInfo.hasNextPage) break
      cursor = data.translatableResources.pageInfo.endCursor
    }
  }
  return out
}

export async function fetchTranslatableResource(
  session: AdminSession,
  resourceId: string,
  locale: string,
): Promise<TranslatableResource | null> {
  const data = await adminRequest<{translatableResource: TranslatableResource | null}>(FETCH_ONE, session, {
    id: resourceId,
    locale,
  })
  return data.translatableResource
}

const REGISTER_BATCH_SIZE = 100

export async function registerTranslations(
  session: AdminSession,
  resourceId: string,
  translations: TranslationInput[],
): Promise<{written: number; errors: Array<{code: string | null; field: string[] | null; message: string}>}> {
  let written = 0
  const errors: Array<{code: string | null; field: string[] | null; message: string}> = []
  for (let i = 0; i < translations.length; i += REGISTER_BATCH_SIZE) {
    const chunk = translations.slice(i, i + REGISTER_BATCH_SIZE)
    const data = await adminRequest<{
      translationsRegister: {
        userErrors: Array<{code: string | null; field: string[] | null; message: string}>
        translations: Array<{key: string; value: string; locale: string}>
      }
    }>(REGISTER, session, {resourceId, translations: chunk})
    const userErrors = data.translationsRegister.userErrors ?? []
    if (userErrors.length) {
      errors.push(...userErrors)
    } else {
      written += chunk.length
    }
  }
  return {written, errors}
}
