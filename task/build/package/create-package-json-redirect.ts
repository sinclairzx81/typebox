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

// prettier-ignore
function writeRedirect(target: string, submodule: string) {
  Fs.mkdirSync(`${target}/${submodule}`, { recursive: true })
  Fs.writeFileSync(`${target}/${submodule}/package.json`,JSON.stringify({
    main: `../build/cjs/${submodule}/index.js`,
    types: `../build/cjs/${submodule}/index.d.ts`,
  }, null, 2))
}
// --------------------------------------------------------------------------------------------------------------------------
// Builds redirect directories for earlier versions of Node. Note that TypeScript will use these directories to
// resolve types when tsconfig.json is configured for `moduleResolution: 'node'`. This approach is referred to as
// `package-json-redirect` and enables correct type resolution in lieu of a correct end user configuration.
//
// https://github.com/andrewbranch/example-subpath-exports-ts-compat/tree/main/examples/node_modules/package-json-redirects
// --------------------------------------------------------------------------------------------------------------------------

// prettier-ignore
export function createPackageJsonRedirect(target: string, submodules: string[]) {
  submodules.forEach((submodule) => writeRedirect(target, submodule))
}
