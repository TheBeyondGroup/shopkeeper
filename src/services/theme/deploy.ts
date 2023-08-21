import { AbortError } from "@shopify/cli-kit/node/error";
import { AdminSession } from "@shopify/cli-kit/node/session";
import { updateTheme } from "@shopify/cli-kit/node/themes/themes-api";
import { getLatestGitCommit } from "@shopify/cli-kit/node/git";
import { findThemes } from "@shopify/theme/dist/cli/utilities/theme-selector.js";
import { pullLiveThemeSettings, push, pushLive } from "../../utilities/theme.js";
import { findPathUp } from "@shopify/cli-kit/node/fs";
import { BLUE_GREEN_STRATEGY } from "../../utilities/constants.js";

type OnDeckTheme = {
  id: number,
  name: string
}

export async function deploy(adminSession: AdminSession, path: string, themeFlags: string[], strategy: string, blue: number, green: number) {
  switch (strategy) {
    case BLUE_GREEN_STRATEGY:
      await blueGreenDeploy(adminSession, path, themeFlags, blue, green)
      break;

    default:
      basicDeploy(adminSession, path, themeFlags)
      break;
  }
}

export async function blueGreenDeploy(adminSession: AdminSession, path: string, themeFlags: string[], blue: number, green: number) {
  const liveThemeId = await getLiveTheme(adminSession)
  const onDeckTheme = getOnDeckThemeId(liveThemeId, blue, green)

  await pullLiveThemeSettings(adminSession, path, themeFlags)
  await push(adminSession, path, themeFlags, onDeckTheme.id)

  const headSHA = await gitHeadHash()
  const onDeckThemeName = `[${headSHA}] Production - ${onDeckTheme.name}`
  await updateTheme(onDeckTheme.id, { name: onDeckThemeName }, adminSession)
  // add output for rename of theme
}

export async function basicDeploy(adminSession: AdminSession, path: string, themeFlags: string[]) {
  const liveThemeId = await getLiveTheme(adminSession)

  await pullLiveThemeSettings(adminSession, path, themeFlags)
  await pushLive(adminSession, path, themeFlags)

  const headSHA = await gitHeadHash()
  const themeName = `[${headSHA}] Production`
  await updateTheme(liveThemeId, { name: themeName }, adminSession)
  // add output for rename of theme
}

export async function getLiveTheme(adminSession: AdminSession): Promise<number> {
  const themes = await findThemes(adminSession, { live: true })
  if (!themes.length) {
    throw new AbortError("Something very bad has happened. The store doesn't have a live theme.")
  }
  return themes[0]!.id
}

export function getOnDeckThemeId(liveThemeId: number, blueThemeId: number, greenThemeId: number): OnDeckTheme {
  if (liveThemeId === blueThemeId) {
    return { id: greenThemeId, name: "Green" }
  } else {
    return { id: blueThemeId, name: "Blue" }
  }
}

async function gitHeadHash(): Promise<string> {
  const gitDirectory = await findPathUp(".git", { type: "directory" })
  const latestCommit = await getLatestGitCommit(gitDirectory)
  return latestCommit.hash.substring(0, 8)
}
