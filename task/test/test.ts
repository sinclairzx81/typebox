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

import * as Manifest from './manifest.ts'
import * as Task from '../task.ts'

// ------------------------------------------------------------------
// Test
// ------------------------------------------------------------------
export async function test(roots: string[], options: { filter?: string } = {}): Promise<void> {
  const manifest = await Manifest.write(roots)
  const args = ['node', '--test']
  // const args = ['node', '--test', '--test-isolation=none']
  // const args = ['node', '--test', `--test-concurrency=${Os.availableParallelism()}`]
  // const args = ['node', '--test', '--test-isolation=none', `--test-concurrency=${Os.availableParallelism()}`]
  if (options.filter) args.push(`--test-name-pattern=${options.filter}`)
  args.push(manifest)
  const command = args.map((argument) => JSON.stringify(argument)).join(' ')
  await Task.shell(command, process.cwd(), 'node --test target/test/manifest.ts')
}
