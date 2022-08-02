import { shell } from '@sinclair/hammer'
import { statSync, readdirSync } from 'fs'
import { basename, extname } from 'path'

export async function measure(test: string) {
  await shell(`hammer build benchmark/compression/module/${test}.ts --dist target/benchmark/compression`)
  const compiled = statSync(`target/benchmark/compression/${test}.js`)
  await shell(`hammer build benchmark/compression/module/${test}.ts --dist target/benchmark/compression --minify`)
  const minified = statSync(`target/benchmark/compression/${test}.js`)
  return {
    test: test.padEnd(20),
    compiled: `${Math.floor(compiled.size / 1000)} kb`.padStart(8),
    minified: `${Math.floor(minified.size / 1000)} kb`.padStart(8),
    ratio: compiled.size / minified.size,
  }
}

export async function compression() {
  const tests = readdirSync('benchmark/compression/module').map((name) => basename(name, extname(name)))
  const results = await Promise.all(tests.map((test) => measure(test)))
  const present = results.reduce((acc, c) => {
    return { ...acc, [c.test.replace('-', '/')]: { Compiled: c.compiled, Minified: c.minified, Compression: `${c.ratio.toFixed(2)} x` } }
  }, {})
  console.table(present)
}
