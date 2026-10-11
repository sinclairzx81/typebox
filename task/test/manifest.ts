/*--------------------------------------------------------------------------

TypeBox

The MIT License (MIT)

Copyright (c) 2017-2026 Haydn Paterson

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the 'Software'), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

---------------------------------------------------------------------------*/

import * as Path from 'node:path'
import * as Task from '../task.ts'

// ------------------------------------------------------------------
// Write
//
// Generates a singular test entry point to avoid per-file workers.
// Note that --experimental-test-isolation=none tends to be faster,
// but buffers output in-process which is untennable given the number
// of tests in the suite. We prefer streaming over stdout to keep
// buffering to a minimum (review)
// ------------------------------------------------------------------
export async function write(roots: string[]): Promise<string> {
  const manifestPath = 'target/test/manifest.ts'
  const manifestDirectory = Path.resolve(Path.dirname(manifestPath))
  const directories = await Promise.all(roots.map((root) => Task.readDirectoryRecursive(root)))
  const files = [...new Set(directories.flat())]
    .filter((file) => file.endsWith('.ts') && !Path.basename(file).startsWith('_'))
    .sort()
  if (files.length === 0) throw new Error(`No test files found in roots: ${roots.join(', ')}`)
  const imports = files.map((file) => {
    const path = Path.relative(manifestDirectory, Path.resolve(file)).replaceAll(Path.sep, '/')
    const specifier = path.startsWith('.') ? path : `./${path}`
    return `import ${JSON.stringify(specifier)}`
  })
  await Task.write(manifestPath, `${imports.join('\n')}\n`)
  return manifestPath
}
