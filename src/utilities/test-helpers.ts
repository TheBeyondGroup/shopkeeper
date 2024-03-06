import { fileExists, readFile } from '@shopify/cli-kit/node/fs';
import { expect } from 'vitest';

export async function expectFileToExist(path: string) {
  expect(await fileExists(path)).toBeTruthy();
}

export async function expectFileNotToExist(path: string) {
  expect(await fileExists(path)).not.toBeTruthy()
}

export async function expectFileToHaveContent(path: string, expectedContent: string) {
  const content = await readFile(path)
  expect(content).toMatch(expectedContent)
}
