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

const InvalidIriReferenceChars = /[\x00-\x20\x7f"<>\^`{|}\\]|%(?![0-9a-fA-F]{2})/
const MalformedScheme = /^(?:[a-z][a-z\d+\-.]*\/\/|(?!(?:[a-z][a-z\d+\-.]*:))[^/?#]*:)/i
const MultipleAuthorityAtSigns = /^(?:[a-z][a-z\d+\-.]*:)?\/\/[^/?#@]*@[^/?#@]*@/i
const BracketedPath = /^(?:[a-z][a-z\d+\-.]*:\/\/[^/?#]*\/|\/\/[^/?#]*\/|[a-z][a-z\d+\-.]*:(?!\/\/)|(?![a-z][a-z\d+\-.]*:|\/\/))[^?#]*[\[\]]/i

/**
 * Returns true if the value is an IRI reference
 * @specification https://tools.ietf.org/html/rfc3987
 */
export function IsIriReference(value: string): boolean {
  return (
    !InvalidIriReferenceChars.test(value) &&
    !MalformedScheme.test(value) &&
    !MultipleAuthorityAtSigns.test(value) &&
    !BracketedPath.test(value) &&
    URL.canParse(value, 'http://example.com')
  )
}
