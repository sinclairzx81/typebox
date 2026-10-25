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

import * as BuildInfo from '../buildinfo/index.ts'

// ------------------------------------------------------------------
// IdentifierPattern
// ------------------------------------------------------------------
const IdentifierPattern = /^[A-Za-z_$][A-Za-z0-9_$]*$/

// ------------------------------------------------------------------
// Reserved
// ------------------------------------------------------------------
const Reserved = new Set([
  // JS reserved / strict-mode words
  'break',
  'case',
  'catch',
  'class',
  'const',
  'continue',
  'debugger',
  'default',
  'delete',
  'do',
  'else',
  'enum',
  'export',
  'extends',
  'false',
  'finally',
  'for',
  'function',
  'if',
  'import',
  'in',
  'instanceof',
  'new',
  'null',
  'return',
  'super',
  'switch',
  'this',
  'throw',
  'true',
  'try',
  'typeof',
  'var',
  'void',
  'while',
  'with',
  'yield',
  'let',
  'static',
  'implements',
  'interface',
  'package',
  'private',
  'protected',
  'public',
  'await',
  'arguments',
  'eval',
  // TS built-in type names that can't be declared as type aliases
  'any',
  'unknown',
  'never',
  'string',
  'number',
  'boolean',
  'symbol',
  'bigint',
  'object',
  'undefined'
])

// ------------------------------------------------------------------
// Identifier
// ------------------------------------------------------------------
/** Returns a valid JavaScript identifier. This function will throw if the name cannot be serialized as an identifier. */
export function Identifier(_info: BuildInfo.BuildInfo, name: string): string {
  if (!IdentifierPattern.test(name)) {
    throw Error(`Invalid schema name ${JSON.stringify(name)} is not a valid JavaScript identifier`)
  }
  if (Reserved.has(name)) {
    throw Error(`Invalid schema name ${JSON.stringify(name)} is a reserved word`)
  }
  return name
}
