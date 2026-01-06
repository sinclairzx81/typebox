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

const TIME = /^(\d\d):(\d\d):(\d\d(?:\.\d+)?)(?:Z|([+-])(\d\d):(\d\d))?$/i

/**
 * Returns true if the value is a ISO time string
 * @specification
 */
export function IsTime(value: string, strictTimeZone: boolean = true): boolean {
  const matches: string[] | null = TIME.exec(value)
  if (!matches) return false
  const hr: number = +matches[1]
  const min: number = +matches[2]
  const sec: number = +matches[3]
  const tzSign: number = matches[4] === '-' ? -1 : 1 // Use matches[4] for sign
  const tzH: number = +(matches[5] || 0) // tzH is now matches[5]
  const tzM: number = +(matches[6] || 0) // tzM is now matches[6]
  if (tzH > 23 || tzM > 59) return false // Check for valid hour/minute range in offset
  if (strictTimeZone && !matches[4] && value.toLowerCase().indexOf('z') === -1) {
    // If strictTimeZone is true, and neither 'Z' nor a '+/-' offset was found
    return false
  }
  if (hr <= 23 && min <= 59 && sec < 60) return true
  const utcMin = min - tzM * tzSign
  const utcHr = hr - tzH * tzSign - (utcMin < 0 ? 1 : 0)
  return (utcHr === 23 || utcHr === -1) && (utcMin === 59 || utcMin === -1) && sec < 61
}
