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

const alpha = 'a-zA-Z\u00A1-\uFFFF' // Alphanumeric + Unicode characters (no symbols)
const alpha_num = 'a-zA-Z0-9\u00A1-\uFFFF' // Alphanumeric + Unicode characters (no symbols)
const pattern = new RegExp(`^(?!:\/\/)(?:[${alpha_num}-]{1,63}\\.)*[${alpha_num}][${alpha_num}-]{0,61}[${alpha_num}]\\.[${alpha}]{2,}$`)

// example.☺com --- the above says this is a valid hostname_idn..

export function IsIdnHostname(value: string): boolean {
  return pattern.test(value)
}

FormatRegistry.Set('idn-hostname', IsIdnHostname)
