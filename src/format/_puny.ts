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

// ------------------------------------------------------------------
// PunyCode (RFC 3492)
// ------------------------------------------------------------------
const PUNYCODE_BASE = 36
const PUNYCODE_TMIN = 1
const PUNYCODE_TMAX = 26
const PUNYCODE_SKEW = 38
const PUNYCODE_DAMP = 700
const PUNYCODE_INITIAL_BIAS = 72
const PUNYCODE_INITIAL_N = 128

// ------------------------------------------------------------------
// Adapt
// ------------------------------------------------------------------
function Adapt(delta: number, numPoints: number, firstTime: boolean): number {
  delta = firstTime ? Math.floor(delta / PUNYCODE_DAMP) : delta >> 1
  delta += Math.floor(delta / numPoints)
  let k = 0
  while (delta > (((PUNYCODE_BASE - PUNYCODE_TMIN) * PUNYCODE_TMAX) >> 1)) {
    delta = Math.floor(delta / (PUNYCODE_BASE - PUNYCODE_TMIN))
    k += PUNYCODE_BASE
  }
  return k + Math.floor(((PUNYCODE_BASE - PUNYCODE_TMIN + 1) * delta) / (delta + PUNYCODE_SKEW))
}
// ------------------------------------------------------------------
// Decode
// ------------------------------------------------------------------
export function Decode(input: string): string {
  const output: number[] = []
  let n = PUNYCODE_INITIAL_N
  let i = 0
  let bias = PUNYCODE_INITIAL_BIAS
  const delimIdx = input.lastIndexOf('-')
  if (delimIdx > 0) {
    for (let j = 0; j < delimIdx; j++) {
      const cp = input.charCodeAt(j)
      if (cp >= 128) throw new Error('Invalid punycode: non-basic before delimiter')
      output.push(cp)
    }
  }
  let inIdx = delimIdx < 0 ? 0 : delimIdx + 1
  while (inIdx < input.length) {
    const oldi = i
    let w = 1
    let k = PUNYCODE_BASE
    while (true) {
      if (inIdx >= input.length) throw new Error('Invalid punycode: unexpected end of input')
      const ch = input.charCodeAt(inIdx++)
      let digit: number
      if (ch >= 0x61 && ch <= 0x7a) digit = ch - 0x61 // a-z => 0-25
      else if (ch >= 0x30 && ch <= 0x39) digit = ch - 0x30 + 26 // 0-9 => 26-35
      else if (ch >= 0x41 && ch <= 0x5a) digit = ch - 0x41 // A-Z => 0-25
      else throw new Error('Invalid punycode: bad digit character')
      i += digit * w
      const t = k <= bias ? PUNYCODE_TMIN : k >= bias + PUNYCODE_TMAX ? PUNYCODE_TMAX : k - bias
      if (digit < t) break
      w *= PUNYCODE_BASE - t
      k += PUNYCODE_BASE
    }
    const outLen = output.length + 1
    bias = Adapt(i - oldi, outLen, oldi === 0)
    n += Math.floor(i / outLen)
    i %= outLen
    output.splice(i, 0, n)
    i++
  }
  return globalThis.String.fromCodePoint(...output)
}
