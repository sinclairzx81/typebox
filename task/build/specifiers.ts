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

// --------------------------------------------------------------------------
// Appends specifiers to include `.mjs` and `.mts` for both JavaScript
// and TypeScript declaration files.
// --------------------------------------------------------------------------

// prettier-ignore
function rewriteInlineImportSpecifiers(content: string): string {
  const pattern = /import\((.*?)\)/g
  while (true) {
    const match = pattern.exec(content)
    if (match === null) return content
    const captured = match[1]
    if(captured.includes('.mjs')) continue
    const specifier = captured.slice(1, captured.length - 1)
    content = content.replace(captured, `"${specifier}.mjs"`)
  }
}
// prettier-ignore
function rewriteExportSpecifiers(content: string): string {
  const pattern = /(export|import)(.*) from ('(.*)');/g
  while(true) {
    const match = pattern.exec(content)
    if(match === null) return content
    const captured = match[3]
    const specifier = captured.slice(1, captured.length - 1)
    content = content.replace(captured, `'${specifier}.mjs'`)
  }
}
export function rewriteSpecifiers(content: string): string {
  const pass1 = rewriteExportSpecifiers(content)
  const pass2 = rewriteInlineImportSpecifiers(pass1)
  return pass2
}
