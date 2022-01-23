import { shell } from '@sinclair/hammer'

export async function measurement() {
  await shell(`hammer run benchmark/measurement/module/index.ts --dist target/benchmark/measurement`)
}
