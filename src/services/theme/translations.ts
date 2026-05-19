import {AdminSession, ensureAuthenticatedThemes} from '@shopify/cli-kit/node/session'
import {outputInfo, outputWarn} from '@shopify/cli-kit/node/output'
import {AbortError} from '@shopify/cli-kit/node/error'
import {ensureThemeStore} from '../../utilities/shopify/theme-store.js'
import {getLiveTheme, getOnDeckThemeId} from './deploy.js'
import {mapWithConcurrency} from '../../utilities/concurrency.js'
import {
  fetchTranslatableResource,
  listLiveThemeResourcesWithContent,
  listThemeResources,
  publishedNonPrimaryLocales,
  registerTranslations,
  ThemeResourceType,
  THEME_RESOURCE_TYPES,
  TranslatableResource,
} from '../../utilities/translations.js'

export interface MirrorTranslationsFlags {
  store?: string
  password?: string
  from?: number
  to?: number
  blue?: number
  green?: number
  locale?: string
  resourceType?: string
  dryRun?: boolean
  noColor?: boolean
  verbose?: boolean
}

export interface MirrorTranslationsResult {
  fromThemeId: string
  toThemeId: string
  locales: string[]
  skipped: boolean
  perLocale: Array<{
    locale: string
    resources: number
    writes: number
    alreadyInSync: number
    skippedKeysMissingOnTarget: number
    skippedResourcesMissingOnTarget: number
    errors: Array<{code: string | null; field: string[] | null; message: string}>
  }>
}

const FETCH_CONCURRENCY = 8

// Resource types whose aggregate translation maps are used by isMirrorNeeded
// to decide whether the full mirror can be short-circuited. ONLINE_STORE_THEME
// aggregates section.* translations across the entire theme;
// ONLINE_STORE_THEME_LOCALE_CONTENT carries `locales/*.json` overrides;
// ONLINE_STORE_THEME_SETTINGS_DATA_SECTIONS carries merchant-edited settings.
// Together these cover the surfaces Translate & Adapt writes to most often.
const PRE_FLIGHT_TYPES: ThemeResourceType[] = [
  'ONLINE_STORE_THEME',
  'ONLINE_STORE_THEME_LOCALE_CONTENT',
  'ONLINE_STORE_THEME_SETTINGS_DATA_SECTIONS',
]

// Determines source/target theme IDs for the mirror.
//
//   --from / --to       explicit override (used for recovery scenarios where
//                       the authoritative-translations theme is no longer
//                       [live] — e.g. a deploy stranded the most recent edits
//                       on the previously-live color)
//   --blue / --green    standard recurring use: source = current live theme,
//                       target = the on-deck (about-to-become-live) theme
//
// Anchoring on explicit IDs when provided is intentional: if a deploy slips
// in between when the operator decided to mirror and when the command runs,
// the [live] flag may have flipped, and we do NOT want the mirror direction
// to silently invert and overwrite the freshly-edited theme with stale data.
export async function resolveThemes(
  session: AdminSession,
  flags: MirrorTranslationsFlags,
): Promise<{fromThemeId: string; toThemeId: string; sourceIsLive: boolean}> {
  if (flags.from && flags.to) {
    const liveThemeId = await getLiveTheme(session).catch(() => null)
    return {
      fromThemeId: String(flags.from),
      toThemeId: String(flags.to),
      sourceIsLive: liveThemeId === flags.from,
    }
  }
  if (flags.from || flags.to) {
    throw new AbortError('--from and --to must be provided together (or neither, to derive from blue/green).')
  }
  if (!flags.blue || !flags.green) {
    throw new AbortError(
      'Either provide --from/--to explicitly, or provide --blue and --green (or SKR_FLAG_BLUE_THEME_ID / SKR_FLAG_GREEN_THEME_ID) so the live/on-deck pair can be inferred.',
    )
  }
  const liveThemeId = await getLiveTheme(session)
  const onDeck = getOnDeckThemeId(liveThemeId, flags.blue, flags.green)
  return {fromThemeId: String(liveThemeId), toThemeId: String(onDeck.id), sourceIsLive: true}
}

function swapToTarget(fromResourceId: string, fromThemeId: string, toThemeId: string): string {
  if (fromResourceId.includes(`theme_id=${fromThemeId}`)) {
    return fromResourceId.replace(`theme_id=${fromThemeId}`, `theme_id=${toThemeId}`)
  }
  if (fromResourceId.endsWith(`/${fromThemeId}`)) {
    return fromResourceId.slice(0, -fromThemeId.length) + toThemeId
  }
  throw new AbortError(`Cannot remap resourceId ${fromResourceId} from theme ${fromThemeId} to ${toThemeId}`)
}

function translationsEqual(a: TranslatableResource | null, b: TranslatableResource | null): boolean {
  if (!a || !b) return a === b
  if (a.translations.length !== b.translations.length) return false
  const bMap = new Map(b.translations.map((t) => [t.key, t.value]))
  for (const t of a.translations) {
    if (bMap.get(t.key) !== t.value) return false
  }
  return true
}

// Cheap pre-flight: compare the aggregate translation maps for a handful of
// resource types between source and target. If they all match per-locale, the
// full mirror would be a no-op and we can skip it entirely. ~6 queries vs
// hundreds for a full inventory.
//
// Heuristic, not perfect: in theory a translation could exist on source for a
// resource type NOT in PRE_FLIGHT_TYPES while these three match. In practice
// the three pre-flight types cover where Translate & Adapt writes land for
// the kinds of edits clients actually make. Treat any mismatch as "needs
// mirror" and only skip when everything matches.
export async function isMirrorNeeded(
  session: AdminSession,
  fromThemeId: string,
  toThemeId: string,
  locales: readonly string[],
): Promise<boolean> {
  for (const resourceType of PRE_FLIGHT_TYPES) {
    for (const locale of locales) {
      // ONLINE_STORE_THEME id is the theme id directly; the other two are
      // OnlineStoreThemeX/<theme-id>. Build both.
      const fromRid =
        resourceType === 'ONLINE_STORE_THEME'
          ? `gid://shopify/OnlineStoreTheme/${fromThemeId}`
          : resourceType === 'ONLINE_STORE_THEME_LOCALE_CONTENT'
            ? `gid://shopify/OnlineStoreThemeLocaleContent/${fromThemeId}`
            : `gid://shopify/OnlineStoreThemeSettingsDataSections/${fromThemeId}`
      const toRid = swapToTarget(fromRid, fromThemeId, toThemeId)
      const [from, to] = await Promise.all([
        fetchTranslatableResource(session, fromRid, locale),
        fetchTranslatableResource(session, toRid, locale),
      ])
      if (!translationsEqual(from, to)) return true
    }
  }
  return false
}

async function buildPerLocaleResult(
  session: AdminSession,
  fromThemeId: string,
  toThemeId: string,
  locale: string,
  dryRun: boolean,
  sourceIsLive: boolean,
  resourceTypeFilter?: ThemeResourceType,
): Promise<MirrorTranslationsResult['perLocale'][number]> {
  const result: MirrorTranslationsResult['perLocale'][number] = {
    locale,
    resources: 0,
    writes: 0,
    alreadyInSync: 0,
    skippedKeysMissingOnTarget: 0,
    skippedResourcesMissingOnTarget: 0,
    errors: [],
  }

  // When source is the live theme, the type-scoped translatableResources
  // query already returns content + translations, so we can pull source data
  // in one paginated walk per type (~7 round-trips total) instead of one
  // round-trip per resource (~120+).
  outputInfo(`Inventorying ${locale} translations on source theme ${fromThemeId}...`)
  let sourceEntries: Array<{resourceType: ThemeResourceType; resourceId: string; resource: TranslatableResource}> = []
  if (sourceIsLive) {
    const liveData = await listLiveThemeResourcesWithContent(session, locale, resourceTypeFilter)
    for (const e of liveData) {
      // ONLINE_STORE_THEME comes back as one node per theme — keep only ours.
      if (e.resourceType === 'ONLINE_STORE_THEME') {
        if (e.resource.resourceId !== `gid://shopify/OnlineStoreTheme/${fromThemeId}`) continue
      }
      sourceEntries.push({resourceType: e.resourceType, resourceId: e.resource.resourceId, resource: e.resource})
    }
  } else {
    const ids = await listThemeResources(session, fromThemeId)
    const filtered = resourceTypeFilter ? ids.filter((r) => r.resourceType === resourceTypeFilter) : ids
    const fetched = await mapWithConcurrency(filtered, FETCH_CONCURRENCY, async ({resourceType, resourceId}) => {
      const resource = await fetchTranslatableResource(session, resourceId, locale)
      return resource ? {resourceType, resourceId, resource} : null
    })
    sourceEntries = fetched.filter((e): e is NonNullable<typeof e> => e !== null)
  }

  // Drop resources with no translations on the source — nothing to write.
  const candidates = sourceEntries.filter((e) => e.resource.translations.length > 0)

  // Fetch target counterparts in parallel.
  outputInfo(`Fetching target theme ${toThemeId} resources (${candidates.length})...`)
  const targets = await mapWithConcurrency(candidates, FETCH_CONCURRENCY, async ({resourceId}) => {
    const targetResourceId = swapToTarget(resourceId, fromThemeId, toThemeId)
    const resource = await fetchTranslatableResource(session, targetResourceId, locale)
    return {targetResourceId, resource}
  })

  // Diff + register sequentially per resource (registers are per-resource).
  for (let i = 0; i < candidates.length; i += 1) {
    const src = candidates[i]!
    const tgt = targets[i]!
    if (!tgt.resource) {
      result.skippedResourcesMissingOnTarget += 1
      continue
    }
    const targetDigests = new Map(tgt.resource.translatableContent.map((c) => [c.key, c.digest]))
    const targetValues = new Map(tgt.resource.translations.map((t) => [t.key, t.value]))

    const writes = []
    for (const t of src.resource.translations) {
      const digest = targetDigests.get(t.key)
      if (!digest) {
        result.skippedKeysMissingOnTarget += 1
        continue
      }
      if (targetValues.get(t.key) === t.value) {
        result.alreadyInSync += 1
        continue
      }
      writes.push({key: t.key, value: t.value, locale, translatableContentDigest: digest})
    }

    if (writes.length === 0) continue
    result.resources += 1
    result.writes += writes.length

    if (dryRun) continue

    const reg = await registerTranslations(session, tgt.targetResourceId, writes)
    if (reg.errors.length) {
      outputWarn(
        `  ${src.resourceType} ${tgt.targetResourceId}: ${reg.errors.length} userError${
          reg.errors.length === 1 ? '' : 's'
        }`,
      )
      result.errors.push(...reg.errors)
    }
  }

  return result
}

export async function mirrorTranslations(flags: MirrorTranslationsFlags): Promise<MirrorTranslationsResult> {
  const store = ensureThemeStore({store: flags.store})
  if (!flags.password) {
    throw new AbortError(
      'A Shopify Theme Access password is required. Pass --password or set SHOPIFY_CLI_THEME_TOKEN. The token must come from a Theme Access app whose scopes include read_translations and write_translations.',
    )
  }
  const session = await ensureAuthenticatedThemes(store, flags.password)

  const {fromThemeId, toThemeId, sourceIsLive} = await resolveThemes(session, flags)
  if (fromThemeId === toThemeId) {
    throw new AbortError(`Refusing to mirror translations from theme ${fromThemeId} to itself.`)
  }

  let resourceTypeFilter: ThemeResourceType | undefined
  if (flags.resourceType) {
    if (!(THEME_RESOURCE_TYPES as readonly string[]).includes(flags.resourceType)) {
      throw new AbortError(`Unknown --resource-type ${flags.resourceType}. Allowed: ${THEME_RESOURCE_TYPES.join(', ')}`)
    }
    resourceTypeFilter = flags.resourceType as ThemeResourceType
  }

  const locales = flags.locale ? [flags.locale] : await publishedNonPrimaryLocales(session)
  if (locales.length === 0) {
    outputInfo('No non-primary published locales on this store — nothing to mirror.')
    return {fromThemeId, toThemeId, locales: [], skipped: false, perLocale: []}
  }

  outputInfo(`Mirroring translations: theme ${fromThemeId} -> theme ${toThemeId}`)
  outputInfo(
    `Locales: ${locales.join(', ')}${resourceTypeFilter ? `  (resource type: ${resourceTypeFilter})` : ''}${
      flags.dryRun ? '  (dry-run)' : ''
    }`,
  )

  // Pre-flight: if source and target already match across the aggregate
  // resource types, skip the full inventory. Only applies when no
  // --resource-type filter is set (the filter implies a deliberate, targeted
  // operation that should always run).
  if (!resourceTypeFilter) {
    const needed = await isMirrorNeeded(session, fromThemeId, toThemeId, locales)
    if (!needed) {
      outputInfo(
        'Pre-flight check: source and target translations already in sync across aggregate resource types — skipping full mirror.',
      )
      return {fromThemeId, toThemeId, locales: [...locales], skipped: true, perLocale: []}
    }
  }

  const perLocale: MirrorTranslationsResult['perLocale'] = []
  for (const locale of locales) {
    perLocale.push(
      await buildPerLocaleResult(
        session,
        fromThemeId,
        toThemeId,
        locale,
        flags.dryRun ?? false,
        sourceIsLive,
        resourceTypeFilter,
      ),
    )
  }

  for (const r of perLocale) {
    outputInfo(
      `  ${r.locale}: ${r.writes} write${r.writes === 1 ? '' : 's'} across ${r.resources} resource${
        r.resources === 1 ? '' : 's'
      } (${r.alreadyInSync} already in sync, ${r.skippedKeysMissingOnTarget} keys absent on target, ${
        r.skippedResourcesMissingOnTarget
      } resources absent on target)`,
    )
  }

  return {fromThemeId, toThemeId, locales: [...locales], skipped: false, perLocale}
}
