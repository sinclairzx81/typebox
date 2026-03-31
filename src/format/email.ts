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

import { IsIPv4Internal } from './ipv4.ts'

/**
 * Returns true if the value is an Email
 * @specification Json Schema 2020-12
 */
export function IsEmail(value: string): boolean {
  const dot = value.indexOf('.')
  const at = value.indexOf('@')
  const quoted = value[0] === '"' && value[at - 1] === '"'
  const ipLiteral = value[at + 1] === '[' && value[value.length - 1] === ']'
  const ipv6 = ipLiteral && value.indexOf(':', at) !== -1
  const ipv4 = ipLiteral && !ipv6 && IsIPv4Internal(value, at + 2, value.length - 1)
  return (at > 0 && at < value.length - 1) &&
    !(
      // .test@example.com
      (!quoted && dot === 0) ||
      // te..st@example.com
      (!quoted && dot !== -1 && value.indexOf('.', dot + 1) === dot + 1) ||
      // test.@example.com
      (dot !== -1 && value.indexOf('@', dot) === dot + 1) ||
      // joe bloggs@example.com
      (!quoted && value.indexOf(' ') !== -1) ||
      // user1@oceania.org, user2@oceania.org
      (value.indexOf(',') !== -1) ||
      // joe.bloggs@[127.0.0.300]
      (ipLiteral && !ipv4 && !ipv6) ||
      // joe.bloggs@invalid=domain.com
      (value.indexOf('=', at) !== -1)
    )
}
