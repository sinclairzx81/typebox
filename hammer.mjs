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
    await shell('prettier --no-semi --single-quote --print-width 240 --trailing-comma all --write src test benchmark codegen')
}

// -------------------------------------------------------------------------------
// Start
// -------------------------------------------------------------------------------

export async function start(example = 'index') {
    await shell(`hammer run example/${example}.ts --dist target/example/${example}`)
}

// -------------------------------------------------------------------------------
// Benchmark
// -------------------------------------------------------------------------------

export async function benchmark() {
    await compression()
    await measurement()
}

// -------------------------------------------------------------------------------
// Test
// -------------------------------------------------------------------------------

export async function test_static() {
    await shell(`tsc -p test/static/tsconfig.json --noEmit --strict`)
}

export async function test_runtime(filter) {
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
    await shell(`cd ${target} && npm publish sinclair-typebox-${version}.tgz --access=public --otp ${otp}`)
    await shell(`git tag ${version}`)
    await shell(`git push origin ${version}`)
}