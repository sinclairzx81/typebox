// deno-fmt-ignore-file

import { Syntax } from './task/syntax/index.ts'
import { Website } from './task/website/index.ts'
import { Bench } from './task/bench/index.ts'
import { Turing } from './task/turing/index.ts'
import { Range } from './task/range/index.ts'
import { Metrics } from './task/metrics/index.ts'
import { Task } from 'tasksmith'

const Version = '1.0.11'

// ------------------------------------------------------------------
// BuildPackage
// ------------------------------------------------------------------
const BuildPackage = (target: string = `target/build`) => Task.build.esm('src', {
  outdir: target,
  compiler: '5.9.2',
  additional: ['license', 'readme.md'],
  packageJson: {
    name: 'typebox',
    description: 'A Runtime Type System for JavaScript',
    version: Version,
    keywords: ['typescript', 'jsonschema'],
    license: 'MIT',
    author: 'sinclairzx81',
    repository: {
      type: 'git',
      url: 'https://github.com/sinclairzx81/typebox'
    }
  },
})
// ------------------------------------------------------------------
// PublishPackage
// ------------------------------------------------------------------
const PublishPackage = async (otp: string, target: string = `target/build`) => {
  const { version } = JSON.parse(await Task.file(`${target}/package.json`).read())
  await Task.shell(`cd ${target} && npm publish typebox-${version}.tgz --access=public --otp ${otp}`)
  await Task.shell(`git tag ${version}`)
  await Task.shell(`git push origin ${version}`)
}
// ------------------------------------------------------------------
// Bench
// ------------------------------------------------------------------
Task.run('bench', () => Bench.Run())
// ------------------------------------------------------------------
// Build
// ------------------------------------------------------------------
Task.run('build', (target: string = `target/build`) => BuildPackage(target))
// ------------------------------------------------------------------
// Clean
// ------------------------------------------------------------------
Task.run('clean', () => Task.folder('target').delete())
// ------------------------------------------------------------------
// Local
// ------------------------------------------------------------------
Task.run('local', (target: string = `../build-test/node_modules/typebox`) => BuildPackage(target))
// ------------------------------------------------------------------
// Publish
// ------------------------------------------------------------------
Task.run('publish', (otp: string, target: string = `target/build`) => PublishPackage(otp, target))
// ------------------------------------------------------------------
// Format
// ------------------------------------------------------------------
Task.run('format', () => Task.shell('deno fmt src test/**/*.ts'))
// ------------------------------------------------------------------
// Syntax
// ------------------------------------------------------------------
Task.run('syntax', () => Syntax())
// ------------------------------------------------------------------
// Start
// ------------------------------------------------------------------
Task.run('start', () => Task.shell('deno run -A --watch --no-check example/index.ts'))
// ------------------------------------------------------------------
// Test
// ------------------------------------------------------------------
Task.run('test', (filter: string = '') => Task.test.run(['test/jsonschema', 'test/typebox'], { filter }))
// ------------------------------------------------------------------
// Fast
// ------------------------------------------------------------------
Task.run('fast', (filter: string = '') => Task.test.run(['test/jsonschema', 'test/typebox'], { watch: true, noCheck: true, filter }))
// ------------------------------------------------------------------
// Website
// ------------------------------------------------------------------
Task.run('website', () => Website('docs'))
// ------------------------------------------------------------------
// Turing
// ------------------------------------------------------------------
Task.run('turing', () => Turing.Debug())
// ------------------------------------------------------------------
// Report
// ------------------------------------------------------------------
Task.run('report', () => Task.test.report(['test/jsonschema', 'test/typebox']))
// ------------------------------------------------------------------
// Metrics
// ------------------------------------------------------------------
Task.run('metrics', () => Metrics())
// ------------------------------------------------------------------
// Range
// ------------------------------------------------------------------
Task.run('range', () => Range([
  '5.0.4', '5.1.3', '5.1.6', '5.2.2', '5.3.2', '5.3.3',
  '5.4.3', '5.4.5', '5.5.2', '5.5.3', '5.5.4', '5.6.2',
  '5.6.3', '5.7.2', '5.7.3', 'next', 'latest'
]))
