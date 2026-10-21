// deno-fmt-ignore-file

import * as Path from 'node:path'
import * as Scripts from './example/scripting/index.ts'
import * as Format from './task/format/index.ts'
import * as Syntax from './task/syntax/index.ts'
import * as Website from './task/website/website.ts'
import * as Bench from './task/bench/index.ts'
import * as Range from './task/range/index.ts'
import * as linear from './task/linear/index.ts'
import * as Metrics from './task/metrics/index.ts'
import * as Build from './task/build/build.ts'
import * as Test from './task/test/index.ts'
import * as Spec from './task/spec/index.ts'
import * as Task from './task/task.ts'

const Version = '1.4.2'

// ------------------------------------------------------------------
// BuildTo
// ------------------------------------------------------------------
const BuildTo = (target: string): Promise<void> => Build.build('src', {
  target,
  compiler: '7.0.2',
  additional: ['license', 'readme.md'],
  packageJson: {
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
})
// ------------------------------------------------------------------
// Build
// ------------------------------------------------------------------
Task.run('build', (target: string = 'target/build') => BuildTo(target))
// ------------------------------------------------------------------
// Clean
// ------------------------------------------------------------------
Task.run('clean', () => Task.remove('target'))
// ------------------------------------------------------------------
// Check
// ------------------------------------------------------------------
Task.run('check', () => Task.shell('tsc --project tsconfig.json'))
// ------------------------------------------------------------------
// Compliance
// ------------------------------------------------------------------
Task.run('compliance', (target: string = '../json-schema-compliance-suite/node_modules/typebox') => BuildTo(target))
// ------------------------------------------------------------------
// Bench
// ------------------------------------------------------------------
Task.run('bench', () => Bench.Run())
// ------------------------------------------------------------------
// Local
// ------------------------------------------------------------------
Task.run('local', (target: string = '../build-test/node_modules/typebox') => BuildTo(target))
// ------------------------------------------------------------------
// Publish
// ------------------------------------------------------------------
Task.run('publish', async (target: string = 'target/build') => {
  const { version } = JSON.parse(await Task.read(Path.join(target, 'package.json')))
  await Task.shell(`git tag ${version}`)
  await Task.shell(`git push origin ${version}`)
})
// ------------------------------------------------------------------
// Format
// ------------------------------------------------------------------
Task.run('format', () => Format.format(['src', 'test/typebox', 'task/spec', 'example/index.ts']))
// ------------------------------------------------------------------
// Lint
// ------------------------------------------------------------------
Task.run('lint', () => Task.shell('deno lint src'))
// ------------------------------------------------------------------
// Start
// ------------------------------------------------------------------
Task.run('start', () => Task.shell('node --watch example/index.ts'))
// ------------------------------------------------------------------
// Spec
// ------------------------------------------------------------------
Task.run('spec', () => Spec.refresh('test/jsonschema/cases'))
// ------------------------------------------------------------------
// Fast
// ------------------------------------------------------------------
Task.run('fast', async (filter: string = '') => Test.test(['test/jsonschema', 'test/typebox/runtime'], { filter }))
// ------------------------------------------------------------------
// Test
// ------------------------------------------------------------------
Task.run('test', async (filter: string = '') => {
  await Task.shell('deno lint src')
  await Task.shell('tsc --project tsconfig.json')
  await Test.test(['test/jsonschema', 'test/typebox/runtime'], { filter })
})
// ------------------------------------------------------------------
// Report
// ------------------------------------------------------------------
Task.run('report', () => Test.report(['test/jsonschema', 'test/typebox/runtime']))
// ------------------------------------------------------------------
// Challenge
// ------------------------------------------------------------------
Task.run('challenge', (filter: string = '') => Test.test(['test/typescript'], { filter }))
// ------------------------------------------------------------------
// Website
// ------------------------------------------------------------------
Task.run('website', () => Website.serve('design/website', 'docs', 5000))
// ------------------------------------------------------------------
// Syntax
// ------------------------------------------------------------------
Task.run('syntax', () => Syntax.build())
// ------------------------------------------------------------------
// Turing
// ------------------------------------------------------------------
Task.run('turing', () => Scripts.Turing.Debug())
// ------------------------------------------------------------------
// Automata
// ------------------------------------------------------------------
Task.run('automata', () => Scripts.Automata.Run())
// ------------------------------------------------------------------
// Peano
// ------------------------------------------------------------------
Task.run('peano', () => Scripts.Peano.Run())
// ------------------------------------------------------------------
// Linear
// ------------------------------------------------------------------
Task.run('linear', () => linear.Check())
// ------------------------------------------------------------------
// Metrics
// ------------------------------------------------------------------
Task.run('metrics', () => Metrics.test())
// ------------------------------------------------------------------
// Range
// ------------------------------------------------------------------
Task.run('range', async () => {
  await Range.legacy([
    '5.0.4', '5.1.3', '5.1.6', '5.2.2', '5.3.2', '5.3.3',
    '5.4.3', '5.4.5', '5.5.2', '5.5.3', '5.5.4', '5.6.2',
    '5.6.3', '5.7.2', '5.7.3', '5.9.2', '5.9.3'
  ])
  await Range.modern(['6.0.2', '6.0.3'])
  await Range.modern(['7.0.2', 'next', 'latest'])
})

await Task.execute()
