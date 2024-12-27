/*--------------------------------------------------------------------------

@sinclair/typebox/format

The MIT License (MIT)

2020 Evgeny Poberezkin
2024 Haydn Paterson (sinclair) <haydn.developer@gmail.com>


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

import { FormatRegistry } from '../type/index'

// ------------------------------------------------------------------
// This expression is borrowed the ajv-format project for compatibility. 
// All credit goes to Evgeny Poberezkin and contributors.
// ------------------------------------------------------------------

const JsonPointer = /^(?:\/(?:[^~/]|~0|~1)*)*$/

/**
 * Returns true if this string is a json-pointer
 * @documentation https://datatracker.ietf.org/doc/html/rfc6901
 * @example `/values/0/value`
 */
export function IsJsonPointer(value: string): boolean {
  return JsonPointer.test(value)
}

FormatRegistry.Set('json-pointer', IsJsonPointer)
