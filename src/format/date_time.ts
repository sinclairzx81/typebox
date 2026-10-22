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

import { IsDate } from './date.ts'
import { IsTime } from './time.ts'

// ------------------------------------------------------------------
// RFC 9557 DATE_TIME_SUFFIX
// ------------------------------------------------------------------
const DATE_TIME_SUFFIX =
  /^(?:\[!?(?:(?!\.{1,2}[/\]])[A-Za-z._][A-Za-z._0-9+-]{0,13}(?:\/(?!\.{1,2}[/\]])[A-Za-z._][A-Za-z._0-9+-]{0,13})*|[+-](?:[01][0-9]|2[0-3]):[0-5][0-9])\](?:\[!?[a-z_][a-z_0-9-]*=[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*\])*|(?:\[!?[a-z_][a-z_0-9-]*=[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*\])*)$/

/**
 * Returns true if the string is an [RFC 3339](https://datatracker.ietf.org/doc/html/rfc3339) date-time with optional [RFC 9557](https://datatracker.ietf.org/doc/html/rfc9557) suffix.
 * @specification https://datatracker.ietf.org/doc/html/rfc3339
 * @specification https://datatracker.ietf.org/doc/html/rfc9557
 * @example `2020-12-12T20:20:40+00:00`
 */
export function IsDateTime(value: string): boolean {
  const index = value.indexOf('[')
  const datetime = index === -1 ? value : value.slice(0, index)
  if (index !== -1 && !DATE_TIME_SUFFIX.test(value.slice(index))) return false
  const split: string[] = datetime.split(/T/i)
  return split.length === 2 && IsDate(split[0]) && IsTime(split[1])
}
