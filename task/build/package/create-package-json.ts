/*--------------------------------------------------------------------------

@sinclair/typebox

The MIT License (MIT)

Copyright (c) 2017-2024 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

---------------------------------------------------------------------------*/

import * as Fs from 'node:fs'
import * as Path from 'node:path'

// prettier-ignore
export function createPackageJson(target: string, submodules: string[]) {
  const content = JSON.stringify(resolvePackageJson(submodules), null, 2)
  const targetPath = Path.join(target, 'package.json')
  const targetDir = Path.dirname(targetPath)
  Fs.mkdirSync(targetDir, { recursive: true })
  Fs.writeFileSync(targetPath, content, 'utf-8')
}
// prettier-ignore
function resolvePackageJson(submodules: string[]) {
  return {
    ...resolveMetadata(),
    ...resolveExports(submodules)
  }
}
// prettier-ignore
function resolveSubmoduleExports(submodule: string) {
  return {
    require: {
      types: `./build/cjs/${submodule}/index.d.ts`,
      default: `./build/cjs/${submodule}/index.js`,
    },
    import: {
      types: `./build/esm/${submodule}/index.d.mts`,
      default: `./build/esm/${submodule}/index.mjs`,
    }
  }
}
// prettier-ignore
function resolveExports(submodules: string[]) {
  const exports = submodules.reduce((acc, submodule) => {
    return { ...acc, [`./${submodule}`]: resolveSubmoduleExports(submodule) }
  }, {
    // ... and root module
    ".": {
      "require": {
        "types": "./build/cjs/index.d.ts",
        "default": "./build/cjs/index.js",
        
      },
      "import": {
        "types": "./build/esm/index.d.mts",
        "default": "./build/esm/index.mjs",
      }
    }
  })
  return { exports }
}
// prettier-ignore
function resolveMetadata() {
  const packagePath = Path.join(process.cwd(), 'package.json')
  const packageJson = JSON.parse(Fs.readFileSync(packagePath, 'utf-8'))
  return {
    name: packageJson.name,
    version: packageJson.version,
    description: packageJson.description,
    keywords: packageJson.keywords,
    author: packageJson.author,
    license: packageJson.license,
    repository: packageJson.repository,
    // flagged by socket.dev if not present
    scripts: { test: 'echo test' },
    // disable auto bundle strategy: see https://github.com/esm-dev/esm.sh#bundling-strategy
    'esm.sh': { 'bundle': false }, 
    types: "./build/cjs/index.d.ts",
    main: "./build/cjs/index.js",
    module: "./build/esm/index.mjs"
  }
}
