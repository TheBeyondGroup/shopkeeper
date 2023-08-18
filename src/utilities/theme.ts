import { execCLI2 } from "@shopify/cli-kit/node/ruby"
import { AdminSession } from "@shopify/cli-kit/node/session"
import { cli2settingFlags } from "./bucket.js"

export async function pullLiveThemeSettings(adminSession: AdminSession, path: string, themeFlags: string[]): Promise<void> {
  const settingFilterFlags = cli2settingFlags()
  const command = ['theme', 'pull', path, ...themeFlags, ...settingFilterFlags]
  await execCLI2(command, { store: adminSession.storeFqdn, adminToken: adminSession.token })
}

export async function push(adminSession: AdminSession, path: string, themeFlags: string[], themeId: number) {
  const themeFlag = ['--theme', themeId.toString()]
  const command = ['theme', 'push', path, ...themeFlags, ...themeFlag]
  await execCLI2(command, { store: adminSession.storeFqdn, adminToken: adminSession.token })
}

export async function pushLive(adminSession: AdminSession, path: string, themeFlags: string[]) {
  const themeFlag = ['--live', '--allow-live']
  const command = ['theme', 'push', path, ...themeFlags, ...themeFlag]
  await execCLI2(command, { store: adminSession.storeFqdn, adminToken: adminSession.token })
}
