// deno-fmt-ignore-file

import { Turing, Automata } from './task/engine/index.ts'
import { Syntax } from './task/syntax/index.ts'
import * as Website from './task/website/website.ts'
import { Bench } from './task/bench/index.ts'
import { Range } from './task/range/index.ts'
import { Metrics } from './task/metrics/index.ts'
import { Spec } from './task/spec/index.ts'
import * as Task from './task/task.ts'

const Version = '1.3.36'

// ------------------------------------------------------------------
// PackageMetadata
// ------------------------------------------------------------------
const PackageMetadata = {
  name: 'typebox',
  description: 'Json Schema Type Builder with Static Type Resolution for TypeScript',
  version: Version,
  keywords: ['typescript', 'jsonschema'],
  license: 'MIT',
  author: 'sinclairzx81',
  repository: {
    type: 'git',
    url: 'https://github.com/sinclairzx81/typebox'
  }
}
const TestRoots = ['test/jsonschema', 'test/typebox']
// ------------------------------------------------------------------
// Bench
// ------------------------------------------------------------------
async function build(target: string = 'target/build'): Promise<void> {
  await Task.buildPackage('src', target, PackageMetadata)
}
// ------------------------------------------------------------------
// Bench
// ------------------------------------------------------------------
Task.run('bench', () => Bench.Run())
// ------------------------------------------------------------------
// Build
// ------------------------------------------------------------------
Task.run('build', (target: string = 'target/build') => build(target))
// ------------------------------------------------------------------
// Clean
// ------------------------------------------------------------------
Task.run('clean', () => Task.remove('target'))
// ------------------------------------------------------------------
// Compliance
// ------------------------------------------------------------------
Task.run('compliance', (target: string = '../json-schema-compliance-suite/node_modules/typebox') => build(target))
// ------------------------------------------------------------------
// Local
// ------------------------------------------------------------------
Task.run('local', (target: string = '../build-test/node_modules/typebox') => build(target))
// ------------------------------------------------------------------
// Publish
// ------------------------------------------------------------------
Task.run('publish', async (target: string = 'target/build') => {
  const { version } = JSON.parse(await Task.read(Task.Path.join(target, 'package.json')))
  await Task.shell('git', ['tag', version])
  await Task.shell('git', ['push', 'origin', version])
})
// ------------------------------------------------------------------
// Metrics
// ------------------------------------------------------------------
Task.run('format', () => Task.shell('npm', ['exec', '--', 'deno', 'fmt', 'src', 'test/typebox', 'task/spec']))
// ------------------------------------------------------------------
// Lint
// ------------------------------------------------------------------
Task.run('lint', () => Task.shell('npm', ['exec', '--', 'deno', 'lint', 'src']))
// ------------------------------------------------------------------
// Spec
// ------------------------------------------------------------------
Task.run('spec', () => Spec.refresh('test/jsonschema/cases'))
// ------------------------------------------------------------------
// Syntax
// ------------------------------------------------------------------
Task.run('syntax', () => Syntax())
// ------------------------------------------------------------------
// Start
// ------------------------------------------------------------------
Task.run('start', () => Task.shell(process.execPath, ['--experimental-transform-types', '--watch', 'example/index.ts']))
// ------------------------------------------------------------------
// Test
// ------------------------------------------------------------------
Task.run('test', async (filter: string = '') => {
  await Task.shell('npm', ['run', 'lint'])
  await Task.test(TestRoots, { filter })
})
// ------------------------------------------------------------------
// Challenge
// ------------------------------------------------------------------
Task.run('challenge', (filter: string = '') => Task.test(['test/typescript'], { filter }))
// ------------------------------------------------------------------
// Website
// ------------------------------------------------------------------
Task.run('website', (port: string = '5000') => {
  const value = Number(port)
  if (!Number.isInteger(value) || value < 0 || value > 65535) throw new Error(`Invalid website port '${port}'`)
  return Website.Website('design/website', 'docs', value)
})
// ------------------------------------------------------------------
// Turing
// ------------------------------------------------------------------
Task.run('turing', () => Turing.Debug())
// ------------------------------------------------------------------
// Automata
// ------------------------------------------------------------------
Task.run('automata', () => Automata.Debug())
// ------------------------------------------------------------------
// Report
// ------------------------------------------------------------------
Task.run('report', () => Task.report(TestRoots))
// ------------------------------------------------------------------
// Metrics
// ------------------------------------------------------------------
Task.run('metrics', () => Metrics())
// ------------------------------------------------------------------
// Range
// ------------------------------------------------------------------
Task.run('range', async () => {
  await Range.Legacy([
    '5.0.4', '5.1.3', '5.1.6', '5.2.2', '5.3.2', '5.3.3',
    '5.4.3', '5.4.5', '5.5.2', '5.5.3', '5.5.4', '5.6.2',
    '5.6.3', '5.7.2', '5.7.3', '5.9.2', '5.9.3'
  ])
  await Range.Modern(['6.0.2', '6.0.3'])
  await Range.Modern(['7.0.2', 'next', 'latest'])
})

await Task.execute()
