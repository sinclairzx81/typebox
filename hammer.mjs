// -------------------------------------------------------------------------------
// Clean
// -------------------------------------------------------------------------------

export async function clean() {
    await folder('target').delete()
}

export async function format() {
    await shell('prettier --no-semi --single-quote --print-width 240 --trailing-comma all --write src test')
}

// -------------------------------------------------------------------------------
// Specs
// -------------------------------------------------------------------------------

export async function test_types() {
    await shell(`tsc -p ./src/tsconfig.json --outDir test/static --emitDeclarationOnly`)
    await shell(`tsd test/static`)
}

export async function test_schemas() {
    await shell(`hammer build ./test/runtime/index.ts --dist target/test/runtime --platform node`)
    await shell(`mocha target/test/runtime/index.js`)
}

export async function spec() {
    await test_types()
    await test_schemas()
}

// -------------------------------------------------------------------------------
// Example
// -------------------------------------------------------------------------------

export async function example(target = 'target/example') {
    await shell(`hammer run example/index.ts --dist ${target}`)
}

// -------------------------------------------------------------------------------
// Build
// -------------------------------------------------------------------------------

export async function build(target = 'target/build') {
    await spec()
    await folder(target).delete()
    await shell(`tsc -p ./src/tsconfig.json --outDir ${target}`)
    await folder(target).add('package.json')
    await folder(target).add('readme.md')
    await folder(target).add('license')
    await shell(`cd ${target} && npm pack`)

    // $ npm publish sinclair-typebox-0.x.x.tgz --access=public
    // $ git tag <version>
    // $ git push origin <version>
}
