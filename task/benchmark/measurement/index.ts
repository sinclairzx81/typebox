import { shell } from '@sinclair/hammer'

export async function measurement() {
  await shell(`hammer run task/benchmark/measurement/module/index.ts --dist target/benchmark/measurement`)
}
