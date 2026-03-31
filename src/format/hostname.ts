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

/**
 * Returns true if the value matches RFC 1123 hostname syntax.
 * @specification https://tools.ietf.org/html/rfc1123
 */
export function IsHostname(value: string): boolean {
  if (value.length > 253 || value.length === 0) return false
  let start = 0
  let prev = 0
  for (let i = 0; i < value.length; i++) {
    const ch = value.charCodeAt(i)
    if (ch === 46) { // '.'
      // trailing dot is valid e.g. "example.com." but not "."
      if (i === value.length - 1 && start < i) break
      const len = i - start
      if (len === 0 || len > 63 || value.charCodeAt(start) === 45 || prev === 45) return false
      start = i + 1
    } else if (
      !(
        (ch >= 97 && ch <= 122) || // a-z
        (ch >= 65 && ch <= 90) || // A-Z
        (ch >= 48 && ch <= 57) || // 0-9
        ch === 45 // '-'
      )
    ) {
      return false
    }
    prev = ch
  }
  const length = value.length - start
  const first = value.charCodeAt(start)
  const last = value.charCodeAt(value.length - 1)
  return length > 0 && length <= 63 && first !== 45 && last !== 45
}
