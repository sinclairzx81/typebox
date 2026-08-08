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
 * @specification https://datatracker.ietf.org/doc/html/rfc3339
 */
export function IsTime(value: string, strictTimeZone: boolean = true): boolean {
  const matches: string[] | null = TIME.exec(value)
  if (!matches) return false
  const hr: number = +matches[1]
  const min: number = +matches[2]
  const sec: string = matches[3]
  const secIntegral: number = +sec.split('.')[0]
  const tzSign: number = matches[4] === '-' ? -1 : 1
  const tzH: number = +(matches[5] || 0)
  const tzM: number = +(matches[6] || 0)
  if (hr > 23 || min > 59 || secIntegral > 60) return false
  if (tzH > 23 || tzM > 59) return false
  if (strictTimeZone && !matches[4] && value.toLowerCase().indexOf('z') === -1) {
    return false
  }
  if (secIntegral < 60) return true

  let utcMin = min - tzM * tzSign
  let utcHr = hr - tzH * tzSign
  if (utcMin < 0) {
    utcMin += 60
    utcHr -= 1
  } else if (utcMin > 59) {
    utcMin -= 60
    utcHr += 1
  }
  utcHr = (utcHr + 24) % 24
  return utcHr === 23 && utcMin === 59
}
