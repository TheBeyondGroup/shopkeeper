import { AbortError } from "@shopify/cli-kit/node/error"
import { copyFile, findPathUp, glob } from "@shopify/cli-kit/node/fs"
import { basename, cwd } from "@shopify/cli-kit/node/path"
import { renderSelectPrompt } from "@shopify/cli-kit/node/ui"
import { shopkeeperDirectory } from "./constants.js"

export type FileMove = {
  source: string,
  dest: string,
  file: string
}

export async function getBucketByPrompt() {
  const buckets = await getBuckets()
  return await renderSelectPrompt({
    message: "Select a bucket",
    choices: buckets.map(bucket => {
      return { label: bucket, value: bucket }
    })
  })
}

export async function getBuckets(): Promise<string[]> {
  const shopkeeperRoot = await getShopkeeperPath()
  const buckets = await glob(`${shopkeeperRoot}/*`, { onlyDirectories: true, deep: 1 })
  return buckets.map(path => basename(path))
}

export async function getBucketSettingsFilePaths(bucket: string): Promise<string[]> {
  const bucketRoot = await getBucketPath(bucket)
  const settingsPatterns = getSettingsPatterns()
  const bucketSettingsPaths = await glob(settingsPatterns, { cwd: bucketRoot })
  return bucketSettingsPaths
}

export async function getThemeSettingsFilePaths(path: string): Promise<string[]> {
  const settingsPatterns = getSettingsPatterns()
  const themeSettingsPaths = await glob(settingsPatterns, { cwd: path })
  return themeSettingsPaths
}

export async function getBucketPath(bucket: string): Promise<string> {
  const shopkeeperRoot = await getShopkeeperPath()
  return `${shopkeeperRoot}/${bucket}`
}

export async function getShopkeeperPath(): Promise<string> {
  const shopkeeperRoot = await findPathUp(shopkeeperDirectory, { type: "directory" })
  if (shopkeeperRoot == undefined) {
    throw new AbortError(`Cannot find ${shopkeeperDirectory} directory when searching up from ${cwd()}.`);
  }

  return shopkeeperRoot
}

export function getSettingsPatterns() {
  return [
    'config/settings_data.json',
    'templates/**/*.json',
    'sections/*.json'
  ]
}

export function getSettingsFolders() {
  return [
    'config',
    'templates',
    'sections'
  ]
}

export async function copyFiles(moves: FileMove[]) {
  moves.forEach(async move => {
    await copyFile(move.source, move.dest)
  })
}
