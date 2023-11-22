import { shell } from '@sinclair/hammer'
import { statSync, readdirSync } from 'fs'
import { basename, extname } from 'path'

export async function measure(test: string) {
  await shell(`hammer build task/benchmark/compression/module/${test}.ts --dist target/benchmark/compression`)
  const compiled = statSync(`target/benchmark/compression/${test}.js`)
  await shell(`hammer build task/benchmark/compression/module/${test}.ts --dist target/benchmark/compression --minify`)
  const minified = statSync(`target/benchmark/compression/${test}.js`)
  return {
    test: test.padEnd(20),
    compiled: `${(compiled.size / 1000).toFixed(1)} kb`.padStart(8),
    minified: `${(minified.size / 1000).toFixed(1)} kb`.padStart(8),
    ratio: compiled.size / minified.size,
  }
}

export async function compression() {
  const tests = readdirSync('task/benchmark/compression/module').map((name) => basename(name, extname(name)))
  const results = await Promise.all(tests.map((test) => measure(test)))
  const present = results.reduce((acc, c) => {
    return { ...acc, [c.test.replace(/-/g, '/')]: { Compiled: c.compiled, Minified: c.minified, Compression: `${c.ratio.toFixed(2)} x` } }
  }, {})
  console.table(present)
}
