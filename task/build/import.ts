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

declare function shell(command: string): Promise<void>
import { rewriteSpecifiers } from './specifiers'
import * as Path from 'node:path'
import * as Fs from 'node:fs'

// ------------------------------------------------------------------
// Build
// ------------------------------------------------------------------
// prettier-ignore
export async function buildImport(target: string) {
  const options = [
    `--outDir ${target}/build/import`,
    '--target ESNext',
    '--module ESNext',
    '--declaration',
  ].join(' ')
  await shell(`tsc -p ./src/tsconfig.json ${options}`)
  convertToEsm(`${target}/build/import`)
}
// ------------------------------------------------------------------
// Node | ESM Transform
// ------------------------------------------------------------------
// prettier-ignore
function shouldProcess(sourcePath: string) {
  const extname = Path.extname(sourcePath)
  return ['.js', '.ts'].includes(extname)
}
// prettier-ignore
function newExtension(extname: string) {
  return (
    extname === '.js' ? '.mjs' : 
    extname === '.ts' ? '.mts' : 
    extname
  )
}
// prettier-ignore
function processFile(sourcePath: string) {
  if(!shouldProcess(sourcePath)) return
  const extname = Path.extname(sourcePath)
  const dirname = Path.dirname(sourcePath)
  const basename = Path.basename(sourcePath, extname)
  const new_extname = newExtension(extname)
  const sourceContent = Fs.readFileSync(sourcePath, 'utf-8')
  const targetContent = rewriteSpecifiers(sourceContent)
  const targetPath = `${Path.join(dirname, basename)}${new_extname}`
  Fs.writeFileSync(sourcePath, targetContent)
  Fs.renameSync(sourcePath, targetPath)
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
// prettier-ignore
export function convertToEsm(sourceDirectory: string) {
  readDirectory(sourceDirectory)
}
