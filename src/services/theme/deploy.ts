import { AbortError } from "@shopify/cli-kit/node/error";
import { AdminSession } from "@shopify/cli-kit/node/session";
import { updateTheme } from "@shopify/cli-kit/node/themes/api";
import { getLatestGitCommit } from "@shopify/cli-kit/node/git";
import { findThemes } from "@shopify/theme/dist/cli/utilities/theme-selector.js";
import { pullLiveThemeSettings, push, pushToLive } from "../../utilities/theme.js";
import { findPathUp } from "@shopify/cli-kit/node/fs";
import { BLUE_GREEN_STRATEGY } from "../../utilities/constants.js";
import { renderText } from "@shopify/cli-kit/node/ui";

type OnDeckTheme = {
  id: number,
  name: string
}

export async function deploy(adminSession: AdminSession, path: string, publish: boolean, themeFlags: string[], strategy: string, blue: number, green: number) {
  switch (strategy) {
    case BLUE_GREEN_STRATEGY:
      await blueGreenDeploy(adminSession, path, publish, themeFlags, blue, green)
      break;

    default:
      await basicDeploy(adminSession, path, themeFlags)
      break;
  }
}

export async function blueGreenDeploy(adminSession: AdminSession, path: string, publish: boolean, themeFlags: string[], blue: number, green: number) {
  const liveThemeId = await getLiveTheme(adminSession)
  const onDeckTheme = getOnDeckThemeId(liveThemeId, blue, green)

  renderText({ text: "Pulling theme settings" })
  await pullLiveThemeSettings(adminSession, path, themeFlags)
  await push(adminSession, path, publish, themeFlags, onDeckTheme.id)

  const headSHA = await gitHeadHash()
  const newOnDeckThemeName = `[${headSHA}] Production - ${onDeckTheme.name}`
  await updateTheme(onDeckTheme.id, { name: newOnDeckThemeName }, adminSession)
  renderText({ text: `${onDeckTheme.name} renamed to ${newOnDeckThemeName}` })
}

export async function basicDeploy(adminSession: AdminSession, path: string, themeFlags: string[]) {
  const liveThemeId = await getLiveTheme(adminSession)

  renderText({ text: "Pulling theme settings" })
  await pullLiveThemeSettings(adminSession, path, themeFlags)
  await pushToLive(adminSession, path, themeFlags)

  const headSHA = await gitHeadHash()
  const themeName = `[${headSHA}] Production`
  await updateTheme(liveThemeId, { name: themeName }, adminSession)
  renderText({ text: `Live theme renamed to ${themeName}` })
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

export async function gitHeadHash(): Promise<string> {
  const gitDirectory = await findPathUp(".git", { type: "directory" })
  const latestCommit = await getLatestGitCommit(gitDirectory)
  return latestCommit.hash.substring(0, 8)
}
