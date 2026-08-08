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

// ------------------------------------------------------------------
// Local Part
// ------------------------------------------------------------------
// Note: consecutive dots are already structurally impossible here
// (ATEXT excludes '.', and each dot separator is followed by ATEXT+),
// so the previous `(?!.*\.\.)` lookahead was redundant and removed.
const LOCAL_ATEXT = `[A-Za-z0-9!#$%&'*+/=?^_\`{|}~\\u{0080}-\\u{10FFFF}-]`
const LOCAL_DOT_ATOM = `${LOCAL_ATEXT}+(?:\\.${LOCAL_ATEXT}+)*`
const LOCAL_QUOTED = `"(?:[^"\\\\]|\\\\.)*"`
const DOMAIN_LABEL = `[\\p{L}\\p{N}](?:[\\p{L}\\p{N}-]{0,62})(?<!-)`
const DOMAIN = `${DOMAIN_LABEL}(?:\\.${DOMAIN_LABEL})*`

const IdnEmail = new RegExp(`^(?:${LOCAL_DOT_ATOM}|${LOCAL_QUOTED})@${DOMAIN}$`, 'iu')

/**
 * Returns true if the value is an IdnEmail
 * @specification ajv-formats (unicode-extension)
 */
export function IsIdnEmail(value: string): boolean {
  return IdnEmail.test(value.normalize('NFC'))
}
