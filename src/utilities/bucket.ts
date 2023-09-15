import { AbortError } from "@shopify/cli-kit/node/error"
import { copyFile, fileExists, findPathUp, glob, mkdir, writeFile } from "@shopify/cli-kit/node/fs"
import { outputContent, outputToken } from "@shopify/cli-kit/node/output"
import { basename, cwd, resolvePath } from "@shopify/cli-kit/node/path"
import { renderSelectPrompt } from "@shopify/cli-kit/node/ui"
import { CURRENT_BUCKET_FILE, SHOPKEEPER_DIRECTORY } from "./constants.js"

export type FileMove = {
  source: string,
  dest: string,
  file: string
}

export const DEFAULT_ENV_FILE = [
  "SHOPIFY_CLI_THEME_TOKEN=<Theme Access token>",
  "SHOPIFY_FLAG_STORE=<Shopify store url>",
  "SHOPIFY_FLAG_PATH=<path to folder containing theme>",
  "# Set these flags if you're using the blue/green strategy",
  "# SKR_FLAG_GREEN_THEME_ID=<theme ID>",
  "# SKR_FLAG_BLUE_THEME_ID=<theme ID>"
].join("\n")

export async function createBuckets(buckets: string[]) {
  return await Promise.all(buckets.map(async bucket => {
    const bucketPath = await getBucketPath(bucket)
    await mkdir(bucketPath)
    await writeFile(`${bucketPath}/.env`, DEFAULT_ENV_FILE)
    await writeFile(`${bucketPath}/.env.sample`, DEFAULT_ENV_FILE)
    await mkdir(`${bucketPath}/config`)
    await mkdir(`${bucketPath}/templates`)
    await mkdir(`${bucketPath}/sections`)
  }))
}

export async function getBucketByPrompt() {
  const buckets = await getBuckets()
  if (!buckets.length) {
    throw new AbortError(
      outputContent`No buckets can be found.`,
      outputContent`Run ${outputToken.genericShellCommand('bucket create --bucket <bucket name>')}`
    )
  }
  return await renderSelectPrompt({
    message: "Select a bucket",
    choices: buckets.map(bucket => {
      return { label: bucket, value: bucket }
    })
  })
}

export async function ensureBucketExists(bucket: string, bucketPath: string) {
  const bucketExists = await fileExists(bucketPath)

  if (!bucketExists) {
    throw new AbortError(
      outputContent`${bucket} does not exist.`,
      outputContent`Run ${outputToken.genericShellCommand(`bucket create --bucket ${bucket}`)} to create it first.`
    )
  }
}

export async function getBuckets(): Promise<string[]> {
  const shopkeeperRoot = await getShopkeeperPath()
  const buckets = await glob(`${shopkeeperRoot}/*`, { onlyDirectories: true, deep: 1 })
  return buckets.map(path => basename(path))
}

export async function getBucketSettingsFilePaths(bucket: string): Promise<string[]> {
  const bucketRoot = await getBucketPath(bucket)
  return getSettingsFilePaths(bucketRoot)
}

export async function getThemeSettingsFilePaths(path: string): Promise<string[]> {
  return getSettingsFilePaths(path)
}

export async function getSettingsFilePaths(cwd: string): Promise<string[]> {
  const settingsPatterns = getSettingsPatterns()
  const settingsPaths = await glob(settingsPatterns, { cwd: cwd })
  return settingsPaths
}

export async function getBucketPath(bucket: string): Promise<string> {
  const shopkeeperRoot = await getShopkeeperPath()
  return `${shopkeeperRoot}/${bucket}`
}

export async function getShopkeeperPath(): Promise<string> {
  const shopkeeperRoot = await findPathUp(SHOPKEEPER_DIRECTORY, { type: "directory" })
  if (!shopkeeperRoot) {
    throw new AbortError(outputContent`Cannot find ${SHOPKEEPER_DIRECTORY} directory when searching up from ${outputToken.path(cwd())}.`);
  }

  return shopkeeperRoot
}

export async function getProjectDir() {
  const shopkeeperRoot = await getShopkeeperPath()
  const projectDir = resolvePath(shopkeeperRoot, "..")
  return projectDir
}

export async function setCurrentBucket(bucket: string) {
  const shopkeeperRoot = await getShopkeeperPath()
  const contents = `${bucket} \n`
  await writeFile(`${shopkeeperRoot}/${CURRENT_BUCKET_FILE}`, contents)
}

export function getSettingsPatterns(): string[] {
  return [
    'config/settings_data.json',
    'templates/**/*.json',
    'sections/*.json'
  ]
}

export const CLI_SETTINGS_FLAGS = [
  'config/settings_data.json',
  'sections/*.json',
  'templates/*.json',
  'templates/customers/*.json'
]

export function cli2settingFlags() {
  const patternFlags = CLI_SETTINGS_FLAGS.flatMap(pattern => {
    return ["--only", `${pattern}`]
  })

  return ["--live", ...patternFlags]
}

export function getSettingsFolders() {
  return [
    'config',
    'templates',
    'sections'
  ]
}

export async function copyFiles(moves: FileMove[]) {
  await Promise.all(moves.map(async move => {
    return copyFile(move.source, move.dest)
  }))
}
