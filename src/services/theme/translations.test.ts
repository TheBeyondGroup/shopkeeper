import {beforeEach, describe, expect, test, vi} from 'vitest'
import {AdminSession, ensureAuthenticatedThemes} from '@shopify/cli-kit/node/session'
import {AbortError} from '@shopify/cli-kit/node/error'
import {mirrorTranslations, resolveThemes} from './translations.js'
import {ensureThemeStore} from '../../utilities/shopify/theme-store.js'
import {getLiveTheme, getOnDeckThemeId} from './deploy.js'
import {
  fetchTranslatableResource,
  listLiveThemeResourcesWithContent,
  listThemeResources,
  publishedNonPrimaryLocales,
  registerTranslations,
  TranslatableResource,
} from '../../utilities/translations.js'

vi.mock('@shopify/cli-kit/node/session')
vi.mock('@shopify/cli-kit/node/output')
vi.mock('../../utilities/shopify/theme-store.js')
vi.mock('../../utilities/translations.js', async () => {
  const actual = await vi.importActual<typeof import('../../utilities/translations.js')>(
    '../../utilities/translations.js',
  )
  return {
    ...actual,
    fetchTranslatableResource: vi.fn(),
    listLiveThemeResourcesWithContent: vi.fn(),
    listThemeResources: vi.fn(),
    publishedNonPrimaryLocales: vi.fn(),
    registerTranslations: vi.fn(),
  }
})
vi.mock('./deploy.js')

const session: AdminSession = {token: 'TKN', storeFqdn: 'example.myshopify.com'}

// Tests deliberately pass a --resource-type filter on the happy paths so the
// isMirrorNeeded pre-flight is skipped (pre-flight is opinionated and tested
// separately). The recovery path is exercised by passing from/to explicitly
// (resolveThemes returns sourceIsLive=false), which uses listThemeResources +
// per-resource fetch rather than listLiveThemeResourcesWithContent.

const RECOVERY_FLAGS = {password: 'shptka_xxx', from: 1, to: 2} as const

describe('resolveThemes', () => {
  beforeEach(() => vi.resetAllMocks())

  test('uses explicit --from/--to when provided', async () => {
    vi.mocked(getLiveTheme).mockRejectedValue(new Error('no live theme'))
    const result = await resolveThemes(session, {from: 100, to: 200})
    expect(result).toEqual({fromThemeId: '100', toThemeId: '200', sourceIsLive: false})
  })

  test('sets sourceIsLive when explicit --from matches the live theme', async () => {
    vi.mocked(getLiveTheme).mockResolvedValue(100)
    const result = await resolveThemes(session, {from: 100, to: 200})
    expect(result.sourceIsLive).toBe(true)
  })

  test('throws when only one of --from/--to is provided', async () => {
    await expect(resolveThemes(session, {from: 100})).rejects.toThrow(AbortError)
    await expect(resolveThemes(session, {to: 200})).rejects.toThrow(AbortError)
  })

  test('throws when neither --from/--to nor --blue/--green are provided', async () => {
    await expect(resolveThemes(session, {})).rejects.toThrow(AbortError)
  })

  test('derives source = live, target = on-deck from blue/green', async () => {
    vi.mocked(getLiveTheme).mockResolvedValue(2)
    vi.mocked(getOnDeckThemeId).mockReturnValue({id: 1, name: 'Green'})
    const result = await resolveThemes(session, {blue: 2, green: 1})
    expect(result).toEqual({fromThemeId: '2', toThemeId: '1', sourceIsLive: true})
    expect(getLiveTheme).toHaveBeenCalledWith(session)
    expect(getOnDeckThemeId).toHaveBeenCalledWith(2, 2, 1)
  })
})

function resource(themeId: number, contentKeys: string[], translations: Array<{key: string; value: string}>) {
  return {
    resourceId: `gid://shopify/OnlineStoreThemeJsonTemplate/product.foo?theme_id=${themeId}`,
    translatableContent: contentKeys.map((k) => ({key: k, digest: `digest-${k}`, locale: 'en'})),
    translations: translations.map((t) => ({...t, locale: 'fr'})),
  } as TranslatableResource
}

describe('mirrorTranslations', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.mocked(ensureThemeStore).mockReturnValue('example.myshopify.com')
    vi.mocked(ensureAuthenticatedThemes).mockResolvedValue(session)
    vi.mocked(getLiveTheme).mockRejectedValue(new Error('no live theme'))
  })

  test('requires a Theme Access password', async () => {
    await expect(mirrorTranslations({from: 1, to: 2})).rejects.toThrow(AbortError)
  })

  test('refuses to mirror from a theme to itself', async () => {
    await expect(mirrorTranslations({password: 'shptka_x', from: 5, to: 5})).rejects.toThrow(AbortError)
  })

  test('no-ops when there are no non-primary published locales', async () => {
    vi.mocked(publishedNonPrimaryLocales).mockResolvedValue([])
    const result = await mirrorTranslations(RECOVERY_FLAGS)
    expect(result.locales).toEqual([])
    expect(result.skipped).toBe(false)
    expect(registerTranslations).not.toHaveBeenCalled()
  })

  test('writes translations whose source content digest exists on the target', async () => {
    vi.mocked(publishedNonPrimaryLocales).mockResolvedValue(['fr'])
    vi.mocked(listThemeResources).mockResolvedValue([
      {
        resourceType: 'ONLINE_STORE_THEME_JSON_TEMPLATE',
        resourceId: 'gid://shopify/OnlineStoreThemeJsonTemplate/product.foo?theme_id=1',
      },
    ])
    vi.mocked(fetchTranslatableResource).mockImplementation(async (_session, rid) => {
      if (rid.endsWith('theme_id=1')) {
        return resource(
          1,
          ['headline', 'cta'],
          [
            {key: 'headline', value: 'Bonjour'},
            {key: 'cta', value: 'Acheter'},
          ],
        )
      }
      return resource(2, ['headline'], [])
    })
    vi.mocked(registerTranslations).mockResolvedValue({written: 1, errors: []})

    const result = await mirrorTranslations({
      ...RECOVERY_FLAGS,
      resourceType: 'ONLINE_STORE_THEME_JSON_TEMPLATE',
    })

    expect(registerTranslations).toHaveBeenCalledOnce()
    expect(registerTranslations).toHaveBeenCalledWith(
      session,
      'gid://shopify/OnlineStoreThemeJsonTemplate/product.foo?theme_id=2',
      [{key: 'headline', value: 'Bonjour', locale: 'fr', translatableContentDigest: 'digest-headline'}],
    )
    expect(result.perLocale[0]?.writes).toBe(1)
    expect(result.perLocale[0]?.skippedKeysMissingOnTarget).toBe(1)
  })

  test('skips writes when target value already matches source (idempotent)', async () => {
    vi.mocked(publishedNonPrimaryLocales).mockResolvedValue(['fr'])
    vi.mocked(listThemeResources).mockResolvedValue([
      {
        resourceType: 'ONLINE_STORE_THEME_JSON_TEMPLATE',
        resourceId: 'gid://shopify/OnlineStoreThemeJsonTemplate/product.foo?theme_id=1',
      },
    ])
    vi.mocked(fetchTranslatableResource).mockImplementation(async (_session, rid) => {
      const themeId = rid.includes('theme_id=1') ? 1 : 2
      return resource(themeId, ['headline'], [{key: 'headline', value: 'Bonjour'}])
    })

    const result = await mirrorTranslations({
      ...RECOVERY_FLAGS,
      resourceType: 'ONLINE_STORE_THEME_JSON_TEMPLATE',
    })

    expect(registerTranslations).not.toHaveBeenCalled()
    expect(result.perLocale[0]?.alreadyInSync).toBe(1)
    expect(result.perLocale[0]?.writes).toBe(0)
  })

  test('dryRun builds the plan but does not call registerTranslations', async () => {
    vi.mocked(publishedNonPrimaryLocales).mockResolvedValue(['fr'])
    vi.mocked(listThemeResources).mockResolvedValue([
      {
        resourceType: 'ONLINE_STORE_THEME_JSON_TEMPLATE',
        resourceId: 'gid://shopify/OnlineStoreThemeJsonTemplate/product.foo?theme_id=1',
      },
    ])
    vi.mocked(fetchTranslatableResource).mockImplementation(async (_session, rid) => {
      if (rid.includes('theme_id=1')) {
        return resource(1, ['headline'], [{key: 'headline', value: 'Bonjour'}])
      }
      return resource(2, ['headline'], [])
    })

    const result = await mirrorTranslations({
      ...RECOVERY_FLAGS,
      resourceType: 'ONLINE_STORE_THEME_JSON_TEMPLATE',
      dryRun: true,
    })

    expect(registerTranslations).not.toHaveBeenCalled()
    expect(result.perLocale[0]?.writes).toBe(1)
  })

  test('skips resources that do not exist on the target theme', async () => {
    vi.mocked(publishedNonPrimaryLocales).mockResolvedValue(['fr'])
    vi.mocked(listThemeResources).mockResolvedValue([
      {
        resourceType: 'ONLINE_STORE_THEME_JSON_TEMPLATE',
        resourceId: 'gid://shopify/OnlineStoreThemeJsonTemplate/product.gone?theme_id=1',
      },
    ])
    vi.mocked(fetchTranslatableResource).mockImplementation(async (_session, rid) => {
      if (rid.includes('theme_id=1')) {
        return resource(1, ['headline'], [{key: 'headline', value: 'Bonjour'}])
      }
      return null
    })

    const result = await mirrorTranslations({
      ...RECOVERY_FLAGS,
      resourceType: 'ONLINE_STORE_THEME_JSON_TEMPLATE',
    })

    expect(registerTranslations).not.toHaveBeenCalled()
    expect(result.perLocale[0]?.skippedResourcesMissingOnTarget).toBe(1)
  })

  test('honors --locale to restrict to a single locale instead of every published non-primary', async () => {
    vi.mocked(listThemeResources).mockResolvedValue([])

    await mirrorTranslations({
      ...RECOVERY_FLAGS,
      resourceType: 'ONLINE_STORE_THEME_JSON_TEMPLATE',
      locale: 'es',
    })

    expect(publishedNonPrimaryLocales).not.toHaveBeenCalled()
  })

  test('rejects unknown --resource-type values', async () => {
    await expect(mirrorTranslations({...RECOVERY_FLAGS, resourceType: 'NOT_A_REAL_TYPE'})).rejects.toThrow(AbortError)
  })

  test('skips full mirror when pre-flight check finds source and target already in sync', async () => {
    vi.mocked(publishedNonPrimaryLocales).mockResolvedValue(['fr'])
    // Pre-flight queries three resource types; return identical translations
    // on both sides for each, which should short-circuit the mirror.
    vi.mocked(fetchTranslatableResource).mockImplementation(async (_session, rid) => {
      return {
        resourceId: rid,
        translatableContent: [{key: 'k1', digest: 'd1', locale: 'en'}],
        translations: [{key: 'k1', value: 'Bonjour', locale: 'fr'}],
      } as TranslatableResource
    })

    const result = await mirrorTranslations(RECOVERY_FLAGS)

    expect(result.skipped).toBe(true)
    expect(result.perLocale).toEqual([])
    expect(listThemeResources).not.toHaveBeenCalled()
    expect(listLiveThemeResourcesWithContent).not.toHaveBeenCalled()
    expect(registerTranslations).not.toHaveBeenCalled()
  })

  test('proceeds with full mirror when pre-flight check finds differences', async () => {
    vi.mocked(publishedNonPrimaryLocales).mockResolvedValue(['fr'])
    let call = 0
    vi.mocked(fetchTranslatableResource).mockImplementation(async (_session, rid) => {
      call += 1
      // Pre-flight: first pair (ONLINE_STORE_THEME source then target) differ.
      if (call === 1) {
        return {
          resourceId: rid,
          translatableContent: [{key: 'k1', digest: 'd1', locale: 'en'}],
          translations: [{key: 'k1', value: 'Bonjour', locale: 'fr'}],
        } as TranslatableResource
      }
      if (call === 2) {
        return {
          resourceId: rid,
          translatableContent: [{key: 'k1', digest: 'd1', locale: 'en'}],
          translations: [],
        } as TranslatableResource
      }
      // After pre-flight: full mirror per-resource fetches.
      return null
    })
    vi.mocked(listThemeResources).mockResolvedValue([])

    const result = await mirrorTranslations(RECOVERY_FLAGS)

    expect(result.skipped).toBe(false)
    expect(listThemeResources).toHaveBeenCalledOnce()
  })

  test('uses listLiveThemeResourcesWithContent when source is live', async () => {
    vi.mocked(getLiveTheme).mockResolvedValue(1)
    vi.mocked(publishedNonPrimaryLocales).mockResolvedValue(['fr'])
    // Pre-flight: differences forcing a full mirror.
    let call = 0
    vi.mocked(fetchTranslatableResource).mockImplementation(async (_session, rid) => {
      call += 1
      if (call <= 6) {
        // alternate equal/different across pre-flight pairs — make first pair differ to short-circuit pre-flight quickly
        if (call === 1) {
          return {
            resourceId: rid,
            translatableContent: [],
            translations: [{key: 'a', value: 'x', locale: 'fr'}],
          } as TranslatableResource
        }
        if (call === 2) {
          return {resourceId: rid, translatableContent: [], translations: []} as TranslatableResource
        }
      }
      return {resourceId: rid, translatableContent: [], translations: []} as TranslatableResource
    })
    vi.mocked(listLiveThemeResourcesWithContent).mockResolvedValue([])

    await mirrorTranslations({password: 'shptka_x', from: 1, to: 2})

    expect(listLiveThemeResourcesWithContent).toHaveBeenCalled()
    expect(listThemeResources).not.toHaveBeenCalled()
  })
})
