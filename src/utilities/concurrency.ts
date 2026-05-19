// Tiny bounded-concurrency map. Avoids pulling in p-limit for one use site.
// Resolves to the array of results in input order. Rejects on first error.
export async function mapWithConcurrency<T, U>(
  items: readonly T[],
  concurrency: number,
  fn: (item: T, index: number) => Promise<U>,
): Promise<U[]> {
  if (concurrency < 1) throw new Error('concurrency must be >= 1')
  const results: U[] = new Array(items.length)
  let nextIndex = 0

  async function worker(): Promise<void> {
    while (true) {
      const index = nextIndex++
      if (index >= items.length) return
      results[index] = await fn(items[index]!, index)
    }
  }

  const workers: Promise<void>[] = []
  for (let i = 0; i < Math.min(concurrency, items.length); i += 1) {
    workers.push(worker())
  }
  await Promise.all(workers)
  return results
}
