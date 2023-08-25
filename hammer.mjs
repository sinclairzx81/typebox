import { compression, measurement } from './benchmark'
import { readFileSync } from 'fs'

// -------------------------------------------------------------------------------
// Clean
// -------------------------------------------------------------------------------
export async function clean() {
  await folder('target').delete()
}
// -------------------------------------------------------------------------------
// Format
// -------------------------------------------------------------------------------
export async function format() {
  await shell('prettier --no-semi --single-quote --print-width 240 --trailing-comma all --write src test examples/index.ts benchmark')
}
// -------------------------------------------------------------------------------
// Start
// -------------------------------------------------------------------------------
export async function start() {
  await shell(`hammer run examples/index.ts --dist target/examples`)
}
// -------------------------------------------------------------------------------
// Benchmark
// -------------------------------------------------------------------------------
export async function benchmark_compression() {
  await compression()
}
export async function benchmark_measurement() {
  await measurement()
}
export async function benchmark() {
  await benchmark_compression()
  await benchmark_measurement()
}
// -------------------------------------------------------------------------------
// Test
// -------------------------------------------------------------------------------
export async function test_typescript() {
  for (const version of ['4.9.5', '5.0.4', '5.1.3', '5.1.6', '5.2.2', 'next', 'latest']) {
    await shell(`npm install typescript@${version} --no-save`)
    await test_static()
  }
}
export async function test_static() {
  await shell(`tsc -v`)
  await shell(`tsc -p test/static/tsconfig.json --noEmit --strict`)
}
export async function test_runtime(filter = '') {
  await shell(`hammer build ./test/runtime/index.ts --dist target/test/runtime --platform node`)
  await shell(`mocha target/test/runtime/index.js -g "${filter}"`)
}
export async function test(filter = '') {
  await test_static()
  await test_runtime(filter)
}
// -------------------------------------------------------------------------------
// Build
// -------------------------------------------------------------------------------
export async function build(target = 'target/build') {
  await test()
  await folder(target).delete()
  await shell(`tsc -p ./src/tsconfig.json --outDir ${target}`)
  await folder(target).add('package.json')
  await folder(target).add('readme.md')
  await folder(target).add('license')
  await shell(`cd ${target} && npm pack`)
}
// -------------------------------------------------------------
// Publish
// -------------------------------------------------------------
export async function publish(otp, target = 'target/build') {
  const { version } = JSON.parse(readFileSync('package.json', 'utf8'))
  if(version.includes('-dev')) throw Error(`package version should not include -dev specifier`)
  await shell(`cd ${target} && npm publish sinclair-typebox-${version}.tgz --access=public --otp ${otp}`)
  await shell(`git tag ${version}`)
  await shell(`git push origin ${version}`)
}
// -------------------------------------------------------------
// Publish-Dev
// -------------------------------------------------------------
export async function publish_dev(otp, target = 'target/build') {
  const { version } = JSON.parse(readFileSync(`${target}/package.json`, 'utf8'))
  if(!version.includes('-dev')) throw Error(`development package version should include -dev specifier`)
  await shell(`cd ${target} && npm publish sinclair-typebox-${version}.tgz --access=public --otp ${otp} --tag dev`)
}