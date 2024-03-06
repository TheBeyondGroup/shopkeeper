import { fileExists, inTemporaryDirectory, mkdir, readFile } from '@shopify/cli-kit/node/fs'
import { joinPath } from '@shopify/cli-kit/node/path'
import { describe, expect, test, vi } from 'vitest'
import {
  DEFAULT_ENV_FILE,
  cli2settingFlags,
  createBuckets,
  ensureBucketExists,
  getBucketByPrompt,
  getBucketPath,
  getBucketSettingsFilePaths,
  getBuckets,
  getProjectPath,
  getSettingsFilePaths,
  getSettingsFolders,
  getSettingsPatterns,
  getShopkeeperPath,
  getThemeSettingsFilePaths,
} from './bucket.js'
import { renderSelectPrompt } from '@shopify/cli-kit/node/ui'

vi.mock('@shopify/cli-kit/node/ui')

describe('bucket utilities', () => {
  describe('createBuckets', async () => {
    test('creates a bucket', async () => {
      await inTemporaryDirectory(async (tmpDir: string) => {
        // Given
        const shopkeeperRoot = joinPath(tmpDir, '.shopkeeper')
        await mkdir(shopkeeperRoot)

        const envPath = joinPath(shopkeeperRoot, 'production', '.env')
        const envSamplePath = joinPath(shopkeeperRoot, 'production', '.env.sample')
        const configPath = joinPath(shopkeeperRoot, 'production', 'config')
        const templatesPath = joinPath(shopkeeperRoot, 'production', 'templates')
        const sectionsPath = joinPath(shopkeeperRoot, 'production', 'sections')

        // When
        await createBuckets(shopkeeperRoot, ['production'])

        // Then
        expect(await fileExists(envPath)).toBe(true)
        expect(await readFile(envPath)).toEqual(DEFAULT_ENV_FILE)
        expect(await fileExists(envSamplePath)).toBe(true)
        expect(await readFile(envSamplePath)).toEqual(DEFAULT_ENV_FILE)
        expect(await fileExists(configPath)).toBe(true)
        expect(await fileExists(templatesPath)).toBe(true)
        expect(await fileExists(sectionsPath)).toBe(true)
      })
    })
  })

  describe('getBucketByPrompt', async () => {
    test('throws an error when not buckets are found', async () => {
      // Given
      const shopkeeperRoot = joinPath(__dirname, 'fixtures-without-buckets', '.shopkeeper')

      // When
      const errorFunc = async () => await getBucketByPrompt(shopkeeperRoot)

      // Then
      expect(errorFunc).rejects.toThrowError(/No buckets can be found/)
    })

    test('renders a select prompt', async () => {
      // Given
      const shopkeeperRoot = joinPath(__dirname, 'fixtures', '.shopkeeper')

      // When
      await getBucketByPrompt(shopkeeperRoot)

      // Then
      expect(renderSelectPrompt).toHaveBeenCalledWith({
        message: 'Select a bucket',
        choices: [{ label: 'production', value: 'production' }],
      })
    })
  })

  describe('ensureBucketExists', async () => {
    test('returns list of buckets', async () => {
      // Given
      const bucketName = 'production'
      const shopkeeperRoot = joinPath(__dirname, 'fixtures', '.shopkeeper')

      // When/Then
      expect(() => ensureBucketExists(shopkeeperRoot, bucketName)).not.toThrowError()
    })

    test('throws error', async () => {
      // Given
      const bucketName = 'staging'
      const shopkeeperRoot = joinPath(__dirname, 'fixtures', '.shopkeeper')

      // When/Then
      expect(() => ensureBucketExists(shopkeeperRoot, bucketName)).rejects.toThrowError()
    })
  })

  describe('getBuckets', async () => {
    test('returns list of buckets', async () => {
      // Given
      const shopkeeperRoot = joinPath(__dirname, 'fixtures', '.shopkeeper')

      // When
      const actualBucketNames = await getBuckets(shopkeeperRoot)

      // Then
      expect(actualBucketNames).toEqual(['production'])
    })
  })

  describe('getBucketSettingsFilePaths', async () => {
    test('returns list of setting file paths', async () => {
      // Given
      const shopkeeperRoot = joinPath(__dirname, 'fixtures', '.shopkeeper')
      const bucketName = 'production'

      // When
      const actualSettingsFilePaths = await getBucketSettingsFilePaths(shopkeeperRoot, bucketName)

      // Then
      expect(actualSettingsFilePaths.sort()).toEqual(
        [
          'config/settings_data.json',
          'templates/product.json',
          'templates/customers/account.json',
          'templates/metaobject/toy.json',
          'sections/header-group.json',
        ].sort(),
      )
    })
  })

  describe('getThemeSettingsFilePaths', async () => {
    test('returns list of setting file paths', async () => {
      // Given
      const themeRoot = joinPath(__dirname, 'fixtures', 'theme')

      // When
      const actualSettingsFilePaths = await getThemeSettingsFilePaths(themeRoot)

      // Then
      expect(actualSettingsFilePaths.sort()).toEqual(
        [
          'config/settings_data.json',
          'templates/product.json',
          'templates/customers/account.json',
          'templates/metaobject/toy.json',
          'sections/header-group.json',
        ].sort(),
      )
    })
  })

  describe('getSettingsFilePaths', async () => {
    test('returns list of setting file paths', async () => {
      // Given
      const fixturesPath = joinPath(__dirname, 'fixtures', '.shopkeeper', 'production')

      // When
      const actualSettingsFilePaths = await getSettingsFilePaths(fixturesPath)

      // Then
      expect(actualSettingsFilePaths.sort()).toEqual(
        [
          'config/settings_data.json',
          'templates/product.json',
          'templates/customers/account.json',
          'templates/metaobject/toy.json',
          'sections/header-group.json',
        ].sort(),
      )
    })
  })

  describe('getBucketPath', async () => {
    test('returns path to bucket', async () => {
      // Given
      const fixturesPath = joinPath(__dirname, 'fixtures')
      const bucketName = 'production'
      const shopkeeperRoot = joinPath(fixturesPath, '.shopkeeper')
      const expectedBucketPath = joinPath(fixturesPath, '.shopkeeper', bucketName)

      // When
      const actualBucketPath = await getBucketPath(shopkeeperRoot, bucketName)

      // Then
      expect(actualBucketPath).toMatch(expectedBucketPath)
    })
  })

  describe('getShopkeeperPath', async () => {
    test('returns path to .shopkeeper directory', async () => {
      // Given
      const fixturesPath = joinPath(__dirname, 'fixtures')
      const shopkeeperRoot = joinPath(__dirname, 'fixtures', '.shopkeeper')

      // When
      const actualShopkeeperRoot = await getShopkeeperPath(fixturesPath)

      // Then
      expect(actualShopkeeperRoot).toMatch(shopkeeperRoot)
    })

    test('throws an abort error if the directory cannot be found', async () => {
      // Given
      const fixturesPath = joinPath(__dirname, 'fixtures-that-dont-exist')

      // When
      const errorFunc = async () => await getShopkeeperPath(fixturesPath)

      // Then
      expect(errorFunc).rejects.toThrowError(/Cannot find/)
    })
  })

  describe('getProjectDir', async () => {
    test('return path to .shopkeeper parent directory', async () => {
      // Given
      const fixturesPath = joinPath(__dirname, 'fixtures')
      const shopkeeperRoot = joinPath(__dirname, 'fixtures', '.shopkeeper')

      // When
      const actualProjectDirectory = await getProjectPath(shopkeeperRoot)

      // Then
      expect(actualProjectDirectory).toMatch(fixturesPath)
    })
  })

  describe('getSettingsPatterns', () => {
    test('returns glob patterns for settings files', () => {
      // Given When
      const settingsFolders = getSettingsPatterns()

      // Then
      expect(settingsFolders).toEqual(['config/settings_data.json', 'templates/**/*.json', 'sections/*.json'])
    })
  })

  describe('cliSettingsFlags', () => {
    test('returns cli2 flags for settigns files', () => {
      // Given When
      const settingsFolders = cli2settingFlags()

      // Then
      expect(settingsFolders).toEqual([
        '--live',
        '--only',
        'config/settings_data.json',
        '--only',
        'sections/*.json',
        '--only',
        'templates/*.json',
        '--only',
        'templates/customers/*.json',
        '--only',
        'templates/metaobject/*.json',
      ])
    })
  })

  describe('getSettingsFolders', () => {
    test('returns list of folders that could contain JSON templates', () => {
      // Given When
      const settingsFolders = getSettingsFolders()

      // Then
      expect(settingsFolders).toEqual(['config', 'templates', 'sections'])
    })
  })
})
