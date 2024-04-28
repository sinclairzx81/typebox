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

import * as Path from 'node:path'
import * as Fs from 'node:fs'

// ----------------------------------------------------------------------
// Remove Module Level MIT Notice on Package Distribution
//
// The MIT copyright notice the unnecessarily increases the distribution
// size of the package, this code removes it. The MIT license is available
// in the package root.
//
// ----------------------------------------------------------------------
// prettier-ignore
function escape(content: string) {
  return content.split('').map((c) => `\\${c}`).join('')
}
// prettier-ignore
function removeNotice(content: string): string {
  const open = escape('/*--------------------------------------------------------------------------')
  const close = escape('---------------------------------------------------------------------------*/')
  const critera = 'Permission is hereby granted, free of charge'
  const pattern = new RegExp(`${open}[\\s\\S]*?${close}`, 'gm')
  while (true) {
    const match = pattern.exec(content)
    if (match === null) return content.trimStart()
    if (!match[0].includes(critera)) continue
    content = content.replace(match[0], '')
  }
}
// ------------------------------------------------------------------
// Directory Enumeration
// ------------------------------------------------------------------
// prettier-ignore
function processFile(sourcePath: string) {
  const sourceContent = Fs.readFileSync(sourcePath, 'utf-8')
  const targetContent = removeNotice(sourceContent)
  Fs.writeFileSync(sourcePath, targetContent)
}
// prettier-ignore
function processSourcePath(sourcePath: string) {
  const stat = Fs.statSync(sourcePath)
  if(stat.isDirectory()) return readDirectory(sourcePath)
  if(stat.isFile()) return processFile(sourcePath)
}
// prettier-ignore
function readDirectory(sourceDirectory: string) {
  for(const entry of Fs.readdirSync(sourceDirectory)) {
    const sourcePath = Path.join(sourceDirectory, entry)
    processSourcePath(sourcePath)
  }
}
/** Removes the MIT copyright notices from each source file in the given directory */
export function removeNotices(sourceDirectory: string) {
  readDirectory(sourceDirectory)
}
