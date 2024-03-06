import { AbortError } from '@shopify/cli-kit/node/error'
import {
  copyFile,
  fileExists,
  fileExistsSync,
  findPathUp,
  glob,
  mkdir,
  readFile,
  renameFile,
  writeFile,
} from '@shopify/cli-kit/node/fs'
import { outputContent, outputToken } from '@shopify/cli-kit/node/output'
import { basename, cwd, joinPath, resolvePath } from '@shopify/cli-kit/node/path'
import { renderSelectPrompt } from '@shopify/cli-kit/node/ui'
import { CURRENT_BUCKET_FILE, LEGACY_CURRENT_BUCKET_FILE, SHOPKEEPER_DIRECTORY } from './constants.js'

export type FileMove = {
  source: string
  dest: string
  file: string
}

export const DEFAULT_ENV_FILE = [
  'SHOPIFY_CLI_THEME_TOKEN=<Theme Access token>',
  'SHOPIFY_FLAG_STORE=<Shopify store url>',
  'SHOPIFY_FLAG_PATH=<path to folder containing theme>',
  "# Set these flags if you're using the blue/green strategy",
  '# SKR_FLAG_GREEN_THEME_ID=<theme ID>',
  '# SKR_FLAG_BLUE_THEME_ID=<theme ID>',
].join('\n')

export async function createBuckets(shopkeeperRoot: string, buckets: string[]) {
  return await Promise.all(
    buckets.map(async (bucket) => {
      const bucketPath = await getBucketPath(shopkeeperRoot, bucket)
      await mkdir(bucketPath)
      await writeFile(joinPath(bucketPath, '.env'), DEFAULT_ENV_FILE)
      await writeFile(joinPath(bucketPath, '.env.sample'), DEFAULT_ENV_FILE)
      await mkdir(joinPath(bucketPath, 'config'))
      await mkdir(joinPath(bucketPath, 'templates'))
      await mkdir(joinPath(bucketPath, 'sections'))
    }),
  )
}

export async function getBucketByPrompt(shopkeeperRoot: string) {
  const buckets = await getBuckets(shopkeeperRoot)

  if (!buckets.length) {
    throw new AbortError(
      outputContent`No buckets can be found.`,
      outputContent`Run ${outputToken.genericShellCommand('bucket create --bucket <bucket name>')}`,
    )
  }

  return await renderSelectPrompt({
    message: 'Select a bucket',
    choices: buckets.map((bucket) => {
      return { label: bucket, value: bucket }
    }),
  })
}

export async function ensureBucketExists(shopkeeperRoot: string, bucket: string) {
  const bucketPath = await getBucketPath(shopkeeperRoot, bucket)
  const bucketExists = await fileExists(bucketPath)

  if (!bucketExists) {
    throw new AbortError(
      outputContent`${bucket} does not exist.`,
      outputContent`Run ${outputToken.genericShellCommand(`bucket create --bucket ${bucket}`)} to create it first.`,
    )
  }
}

export async function getBuckets(shopkeeperRoot: string): Promise<string[]> {
  const buckets = await glob(`${shopkeeperRoot}/*`, { onlyDirectories: true, deep: 1 })
  return buckets.map((path) => basename(path))
}

export async function getBucketSettingsFilePaths(shopkeeperRoot: string, bucket: string): Promise<string[]> {
  const bucketRoot = await getBucketPath(shopkeeperRoot, bucket)
  return getSettingsFilePaths(bucketRoot)
}

export async function getThemeSettingsFilePaths(themeRoot: string): Promise<string[]> {
  return getSettingsFilePaths(themeRoot)
}

export async function getSettingsFilePaths(cwd: string): Promise<string[]> {
  const settingsPatterns = getSettingsPatterns()
  const settingsPaths = await glob(settingsPatterns, { cwd: cwd })
  return settingsPaths
}

export async function getBucketPath(shopkeeperRoot: string, bucket: string): Promise<string> {
  return joinPath(shopkeeperRoot, bucket)
}

export async function getShopkeeperPath(currentDirectory: string = cwd()): Promise<string> {
  const shopkeeperRoot = await findPathUp(SHOPKEEPER_DIRECTORY, { type: 'directory', cwd: currentDirectory })
  if (!shopkeeperRoot) {
    throw new AbortError(
      outputContent`Cannot find ${SHOPKEEPER_DIRECTORY} directory when searching up from ${outputToken.path(cwd())}.`,
    )
  }

  return shopkeeperRoot
}

export async function getProjectPath(shopkeeperRoot: string) {
  const projectDir = resolvePath(shopkeeperRoot, '..')
  return projectDir
}

export async function setCurrentBucket(shopkeeperRoot: string, bucket: string): Promise<void> {
  const contents = `${bucket}\n`
  const currentBucketPath = joinPath(shopkeeperRoot, CURRENT_BUCKET_FILE)

  await writeFile(currentBucketPath, contents)
}

export async function getCurrentBucket(shopkeeperRoot: string): Promise<string> {
  const legacyCurrentBucketPath = joinPath(shopkeeperRoot, LEGACY_CURRENT_BUCKET_FILE)
  const currentBucketPath = joinPath(shopkeeperRoot, CURRENT_BUCKET_FILE)

  let currentBucket = ''
  if (fileExistsSync(legacyCurrentBucketPath)) {
    currentBucket = await readFile(legacyCurrentBucketPath)
    await renameFile(legacyCurrentBucketPath, currentBucketPath)
  } else {
    currentBucket = await readFile(currentBucketPath)
  }

  return currentBucket.trim()
}

export function getSettingsPatterns(): string[] {
  return ['config/settings_data.json', 'templates/**/*.json', 'sections/*.json']
}

export const CLI_SETTINGS_FLAGS = [
  'config/settings_data.json',
  'sections/*.json',
  'templates/*.json',
  'templates/customers/*.json',
  'templates/metaobject/*.json',
]

export function cli2settingFlags() {
  const patternFlags = CLI_SETTINGS_FLAGS.flatMap((pattern) => {
    return ['--only', `${pattern}`]
  })

  return ['--live', ...patternFlags]
}

export function getSettingsFolders() {
  return ['config', 'templates', 'sections']
}

export async function copyFiles(moves: FileMove[]) {
  await Promise.all(
    moves.map(async (move) => {
      return copyFile(move.source, move.dest)
    }),
  )
}
