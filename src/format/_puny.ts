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

import { Unreachable } from '../system/unreachable/index.ts'

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
export function Decode(value: string): string {
  const output: number[] = []
  let n = PUNYCODE_INITIAL_N
  let i = 0
  let bias = PUNYCODE_INITIAL_BIAS
  const delimIdx = value.lastIndexOf('-')
  if (delimIdx > 0) {
    for (let j = 0; j < delimIdx; j++) {
      const cp = value.charCodeAt(j)
      if (cp >= 128) throw new Error('Invalid punycode: non-basic before delimiter')
      output.push(cp)
    }
  }
  let inIdx = delimIdx < 0 ? 0 : delimIdx + 1
  while (inIdx < value.length) {
    const oldi = i
    let w = 1
    let k = PUNYCODE_BASE
    while (true) {
      if (inIdx >= value.length) throw new Error('Invalid punycode: unexpected end of input')
      const ch = value.charCodeAt(inIdx++)
      let digit: number
      if (ch >= 0x61 && ch <= 0x7a) digit = ch - 0x61 // a-z => 0-25
      else if (ch >= 0x30 && ch <= 0x39) digit = ch - 0x30 + 26 // 0-9 => 26-35
      // deno-coverage-ignore-start - _idna.ts maps input to lowercase, so we can't reach here
      else if (ch >= 0x41 && ch <= 0x5a) Unreachable() // digit = ch - 0x41 // A-Z => 0-25
      // deno-coverage-ignore-stop
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
// ------------------------------------------------------------------
// DigitToChar
// ------------------------------------------------------------------
function DigitToChar(digit: number): string {
  return digit < 26 ? String.fromCharCode(digit + 0x61) : String.fromCharCode(digit - 26 + 0x30)
}
// ------------------------------------------------------------------
// Encode
//
// Encodes a Unicode string into its Punycode payload (the part that
// follows the 'xn--' ACE prefix). Used to compute the true A-label
// length of a U-label, since the 63-octet label length limit (RFC
// 5891 §4.2.4) applies to the encoded form, not the code point count.
// ------------------------------------------------------------------
export function Encode(input: string): string {
  const codePoints = [...input].map((c) => c.codePointAt(0)!)
  const output: string[] = []
  let n = PUNYCODE_INITIAL_N
  let delta = 0
  let bias = PUNYCODE_INITIAL_BIAS
  let basicLength = 0
  for (const cp of codePoints) {
    if (cp < 0x80) {
      output.push(String.fromCodePoint(cp))
      basicLength++
    }
  }
  let handledCPCount = basicLength
  if (basicLength > 0) output.push('-')
  while (handledCPCount < codePoints.length) {
    let m = Infinity
    for (const cp of codePoints) {
      if (cp >= n && cp < m) m = cp
    }
    delta += (m - n) * (handledCPCount + 1)
    n = m
    for (const cp of codePoints) {
      if (cp < n) delta++
      if (cp === n) {
        let q = delta
        for (let k = PUNYCODE_BASE;; k += PUNYCODE_BASE) {
          const t = k <= bias ? PUNYCODE_TMIN : k >= bias + PUNYCODE_TMAX ? PUNYCODE_TMAX : k - bias
          if (q < t) break
          const digit = t + ((q - t) % (PUNYCODE_BASE - t))
          output.push(DigitToChar(digit))
          q = Math.floor((q - t) / (PUNYCODE_BASE - t))
        }
        output.push(DigitToChar(q))
        bias = Adapt(delta, handledCPCount + 1, handledCPCount === basicLength)
        delta = 0
        handledCPCount++
      }
    }
    delta++
    n++
  }
  return output.join('')
}
