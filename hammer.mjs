// -------------------------------------------------------------------------------
// Clean
// -------------------------------------------------------------------------------

export async function clean() {
    await folder('target').delete()
}

// -------------------------------------------------------------------------------
// Specs
// -------------------------------------------------------------------------------

export async function spec_types() {
    await shell(`tsc -p ./src/tsconfig.json --outDir spec/static --emitDeclarationOnly`)
    await shell(`tsd spec/static`)
}

export async function spec_schemas() {
    await shell(`hammer build ./spec/runtime/index.ts --dist target/spec/runtime --platform node`)
    await shell(`mocha target/spec/runtime/index.js`)
}

export async function spec() {
    await spec_types()
    await spec_schemas()
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
