/*--------------------------------------------------------------------------

TypeBox

The MIT License (MIT)

Copyright (c) 2017-2026 Haydn Paterson 

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

import * as Fsp from 'node:fs/promises'
import * as Path from 'node:path'
import * as Task from '../task.ts'

// ------------------------------------------------------------------
// Format
//
// Keep using Deno fmt and lint without a root deno.json. We do this
// specifically for the trailingCommas which doesn't have CLI option,
// and to keep deno.json out of the project root. 
// 
// TypeBox needs to move to another fmt/lint solution, and the most
// ideal would oxfmt/oxlint except they do not support module level
// ignore. For review.
// ------------------------------------------------------------------
export async function format(paths: string[]): Promise<void> {
  if (paths.length === 0) throw new Error('At least one format path is required')
  const directory = Path.resolve('target/format')
  await Fsp.mkdir(directory, { recursive: true })
  const config = Path.join(directory, 'deno.json')
  await Fsp.writeFile(
    config,
    JSON.stringify({
      fmt: {
        lineWidth: 240,
        semiColons: false,
        singleQuote: true,
        trailingCommas: 'never'
      }
    })
  )
  const targets = paths.map((path) => JSON.stringify(path)).join(' ')
  await Task.shell(`deno fmt --config ${JSON.stringify(config)} ${targets}`)
}
