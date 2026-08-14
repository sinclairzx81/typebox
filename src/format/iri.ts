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

// deno-lint-ignore-file no-control-regex

const InvalidIriChars = /[\x00-\x20<>\^`{|}\\]/
const IpvFutureMatch = /\[[vV][0-9a-fA-F]+\.[^\]]+\]/
const MaxIriLength = 2048

/**
 * Returns true if the value is an IRI.
 * @specification https://datatracker.ietf.org/doc/html/rfc3987
 */
export function IsIri(value: string): boolean {
  // 0. Too large (IpvFutureMatch - Review)
  if (value.length > MaxIriLength) return false
  // 1. Strict rejection of unencoded whitespace and control characters
  if (InvalidIriChars.test(value)) return false
  // 2. Bypass WHATWG parser rejection of IPvFuture by swapping with a valid IPv6 literal
  return URL.canParse(value.replace(IpvFutureMatch, '[::1]'))
}
