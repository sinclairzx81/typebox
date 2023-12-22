/*--------------------------------------------------------------------------

@sinclair/typebox/format

The MIT License (MIT)

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

import { IsDate } from './date'
import { IsTime } from './time'

const DATE_TIME_SEPARATOR = /t|\s/i

/**
 * `[ajv-formats]` ISO8601 DateTime
 * @example `2020-12-12T20:20:40+00:00`
 */
export function IsDateTime(value: string, strictTimeZone?: boolean): boolean {
  const dateTime: string[] = value.split(DATE_TIME_SEPARATOR)
  return dateTime.length === 2 && IsDate(dateTime[0]) && IsTime(dateTime[1], strictTimeZone)
}
