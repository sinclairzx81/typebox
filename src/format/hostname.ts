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

import { FormatRegistry } from '../type/index'

const Allowed = `a-z0-9`
const Hostname = new RegExp(`^(?=.{1,253}\\.?$)[${Allowed}](?:[${Allowed}-]{0,61}[${Allowed}])?(?:\\.[${Allowed}](?:[-${Allowed}]{0,61}[${Allowed}])?)*\\.?$`, 'i')

/**
 * Returns true if this string is a valid hostname
 * @spec https://datatracker.ietf.org/doc/html/rfc1123#section-2.1
 * @see https://github.com/ajv-validator/ajv-formats
 * @author Evgeny Poberezkin and contributors
 * @license MIT
 * @example `domain.com`
 */
export function IsHostname(value: string): boolean {
  return Hostname.test(value)
}
FormatRegistry.Set('hostname', IsHostname)
