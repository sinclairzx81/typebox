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

// deno-fmt-ignore-file

// ------------------------------------------------------------------
// CodePointCount (Branchless 10-bit Shift)
//
// Counts code points by scanning UTF-16 sequences and skipping 
// the second half of each high/low pair. Surrogate blocks are 
// 1024 (2^10) wide and aligned, so shifting right by 10 (0xA) 
// collapses each unit to a constant per block (high: 0x36, 
// low: 0x37). This logic attempts to avoid range comparisons 
// and repeated charCodeAt() calls per iteration by testing 
// equality against a packed (0x3637) pair.
//
// ------------------------------------------------------------------
/** Returns the total number of Unicode code points in the string */
export function CodePointCount(value: string): number {
  let result = 0, index = 0, prev = 0
  while (index < value.length) {
    const next = value.charCodeAt(index++) >> 0xA // shift  (10-bits into high/low)
    result += +(((prev << 8) | next) !== 0x3637)  // packed (or +!(prev === 0x36 && next === 0x37))
    prev = next
  }
  return result
}
// ------------------------------------------------------------------
// IsMaxLength
// ------------------------------------------------------------------
/** Returns true if the string length in Unicode code points is less than or equal to maxLength */
export function IsMaxLength(value: string, maxLength: number): boolean {
  return value.length <= maxLength || (value.length <= (maxLength << 1) && CodePointCount(value) <= maxLength)
}
// ------------------------------------------------------------------
// IsMinLength
// ------------------------------------------------------------------
/** Returns true if the string length in Unicode code points is greater than or equal to minLength */
export function IsMinLength(value: string, minLength: number): boolean {
  return value.length >= (minLength << 1) || (value.length >= minLength && CodePointCount(value) >= minLength)
}
