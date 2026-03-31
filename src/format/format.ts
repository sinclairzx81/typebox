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

export * from './_registry.ts'

export { IsDateTime } from './date-time.ts'
export { IsDate } from './date.ts'
export { IsDuration } from './duration.ts'
export { IsEmail } from './email.ts'
export { IsHostname } from './hostname.ts'
export { IsIdnEmail } from './idn-email.ts'
export { IsIdnHostname } from './idn-hostname.ts'
export { IsIPv4 } from './ipv4.ts'
export { IsIPv6 } from './ipv6.ts'
export { IsIriReference } from './iri-reference.ts'
export { IsIri } from './iri.ts'
export { IsJsonPointerUriFragment } from './json-pointer-uri-fragment.ts'
export { IsJsonPointer } from './json-pointer.ts'
export { IsRegex } from './regex.ts'
export { IsRelativeJsonPointer } from './relative-json-pointer.ts'
export { IsTime } from './time.ts'
export { IsUriReference } from './uri-reference.ts'
export { IsUriTemplate } from './uri-template.ts'
export { IsUri } from './uri.ts'
export { IsUrl } from './url.ts'
export { IsUuid } from './uuid.ts'
