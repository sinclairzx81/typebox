// Cleans this projects build artifacts.
export async function clean() {
    await folder('dist').delete().exec()
    await file('index.js').delete().exec()
    await file('spec.js').delete().exec()
}

// Runs the specs for this project.
export async function spec() {
    await shell('tsc-bundle ./spec/tsconfig.json').exec()
    await shell('mocha ./spec.js').exec()
}

// Builds this package and packs it for npm publishing.
export async function build() {
    await folder('dist').delete().exec()
    await shell('tsc -p ./src/tsconfig.json --outDir dist').exec()
    await folder('dist').add('package.json').exec()
    await folder('dist').add('readme.md').exec()
    await folder('dist').add('license.md').exec()
    await shell('cd dist && npm pack').exec()
    
    // npm publish sinclair-typebox-0.x.x.tgz --access=public
}
