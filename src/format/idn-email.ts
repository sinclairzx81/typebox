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

// Extended for international character sets
const AllowedUser = "a-z0-9!#$%&'*+/=?^_`{|}~\u00A1-\uFFFF"
const AllowedDomain = 'a-z0-9\u00A1-\uFFFF'
const Email = new RegExp(`^[${AllowedUser}-]+(?:\\.[${AllowedUser}-]+)*@(?:[${AllowedDomain}](?:[${AllowedDomain}-]*[${AllowedDomain}])?\\.)+[${AllowedDomain}](?:[${AllowedDomain}-]*[${AllowedDomain}])?$`, 'i')

/**
 * Returns true if this string is a valid idn email address.
 * @spec https://datatracker.ietf.org/doc/html/rfc5321#section-4.1.2
 * @example `example@domain.com`
 */
export function IsIdnEmail(value: string): boolean {
  return Email.test(value)
}

FormatRegistry.Set('idn-email', IsIdnEmail)
