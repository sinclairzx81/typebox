// Cleans this projects build artifacts.
export async function clean() {
    await folder('target').delete().exec()
    await file('index.js').delete().exec()
    await file('spec.js').delete().exec()
}

// Runs the specs for this project.
export async function spec(target = 'target/spec') {
    await shell(`tsc-bundle ./spec/tsconfig.json --outFile ${target}/index.js`).exec()
    await shell(`mocha ${target}/index.js`).exec()
}

// Runs the example in watch mode.
export async function example(target = 'target/example') {
    await file(`${target}/index.js`).create().exec()
    await Promise.all([
        shell(`tsc-bundle example/tsconfig.json --outFile ${target}/index.js --watch`).exec(),
        shell(`cd ${target} && smoke-run index.js -x node index.js`).exec()
    ])
}

// Builds this package and packs it for npm publishing.
export async function build(target = 'target/build') {
    await folder(target).delete().exec()
    await shell(`tsc -p ./src/tsconfig.json --outDir ${target}`).exec()
    await folder(target).add('package.json').exec()
    await folder(target).add('readme.md').exec()
    await folder(target).add('license').exec()
    await shell(`cd ${target} && npm pack`).exec()
    
    // npm publish sinclair-typebox-0.x.x.tgz --access=public
}
