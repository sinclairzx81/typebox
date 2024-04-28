import * as Benchmark from './task/benchmark'
import * as Build from './task/build'
import * as Fs from 'fs'

// -------------------------------------------------------------------------------
// Clean
// -------------------------------------------------------------------------------
export async function clean() {
  await folder('node_modules/typebox').delete()
  await folder('target').delete()
}
// -------------------------------------------------------------------------------
// Format
// -------------------------------------------------------------------------------
export async function format() {
  await shell('prettier --no-semi --single-quote --print-width 240 --trailing-comma all --write src test task example/index.ts')
}
// -------------------------------------------------------------------------------
// Start
// -------------------------------------------------------------------------------
export async function start() {
  await shell(`hammer run example/index.ts --dist target/example`)
}
// -------------------------------------------------------------------------------
// Benchmark
// -------------------------------------------------------------------------------
export async function benchmark() {
  await Benchmark.compression()
  await Benchmark.measurement()
}
// -------------------------------------------------------------------------------
// Test
// -------------------------------------------------------------------------------
export async function test_typescript() {
  for (const version of ['4.9.5', '5.0.4', '5.1.3', '5.1.6', '5.2.2', '5.3.2', '5.3.3', '5.4.3', 'next', 'latest']) {
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
export async function build_check(target = 'target/build') {
  const { version } = JSON.parse(Fs.readFileSync('package.json', 'utf8'))
  await shell(`cd ${target} && attw sinclair-typebox-${version}.tgz`)
}
export async function build(target = 'target/build') {
  await test()
  await clean()
  await Promise.all([
    Build.Package.build(target),
    Build.Esm.build(target),
    Build.Cjs.build(target),
  ])
  await folder(target).add('readme.md')
  await folder(target).add('license')
  await shell(`cd ${target} && npm pack`)
  await build_check(target)
}
// -------------------------------------------------------------------------------
// Install
// -------------------------------------------------------------------------------
export async function install_local() {
  await clean()
  await build('target/typebox')
  await folder('node_modules').add('target/typebox')
}
// -------------------------------------------------------------
// Publish
// -------------------------------------------------------------
export async function publish(otp, target = 'target/build') {
  const { version } = JSON.parse(Fs.readFileSync('package.json', 'utf8'))
  if(version.includes('-dev')) throw Error(`package version should not include -dev specifier`)
  await shell(`cd ${target} && npm publish sinclair-typebox-${version}.tgz --access=public --otp ${otp}`)
  await shell(`git tag ${version}`)
  await shell(`git push origin ${version}`)
}
// -------------------------------------------------------------
// Publish-Dev
// -------------------------------------------------------------
export async function publish_dev(otp, target = 'target/build') {
  const { version } = JSON.parse(Fs.readFileSync(`${target}/package.json`, 'utf8'))
  if(!version.includes('-dev')) throw Error(`development package version should include -dev specifier`)
  await shell(`cd ${target} && npm publish sinclair-typebox-${version}.tgz --access=public --otp ${otp} --tag dev`)
}