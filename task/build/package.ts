/*--------------------------------------------------------------------------

@sinclair/typebox

The MIT License (MIT)

Copyright (c) 2017-2023 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

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

import { submodules } from './submodules'
import * as Fs from 'node:fs'

// prettier-ignore
export function buildPackageJson(target: string) {
  const content = JSON.stringify(resolvePackageJson(), null, 2)
  Fs.writeFileSync(`${target}/package.json`, content, 'utf-8')
}
// prettier-ignore
function resolveSubmoduleExports(submodule: string) {
  return {
    require: {
      default: `./build/require/${submodule}/index.js`,
      types: `./build/require/${submodule}/index.d.ts`
    },
    import: {
      default: `./build/import/${submodule}/index.mjs`,
      types: `./build/import/${submodule}/index.d.mts`,
    }
  }
}
// prettier-ignore
function resolveExports() {
  const exports = submodules.reduce((acc, submodule) => {
    return { ...acc, [`./${submodule}`]: resolveSubmoduleExports(submodule) }
  }, {
    // ... and root module
    ".": {
      "require": {
        "default": "./build/require/index.js",
        "types": "./build/require/index.d.ts"
      },
      "import": {
        "default": "./build/import/index.mjs",
        "types": "./build/import/index.d.mts"
      }
    }
  })
  return { exports }
}
// prettier-ignore
function resolveMetadata() {
  const packageJson = JSON.parse(Fs.readFileSync('package.json', 'utf-8'))
  return {
    name: packageJson.name,
    version: packageJson.version,
    description: packageJson.description,
    keywords: packageJson.keywords,
    author: packageJson.author,
    license: packageJson.license,
    repository: packageJson.repository,
    scripts: { test: 'echo test' }, // flagged by socket.dev
    module: "./build/import/index.mjs",
    types: "./build/require/index.d.ts",
    main: "./build/require/index.js"
  }
}
// prettier-ignore
function resolvePackageJson() {
  return {
    ...resolveMetadata(),
    ...resolveExports()
  }
}
