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

import { IsDateTime } from './date_time.ts'
import { IsDate } from './date.ts'
import { IsDuration } from './duration.ts'
import { IsEmail } from './email.ts'
import { IsHostname } from './hostname.ts'
import { IsIdnEmail } from './idn_email.ts'
import { IsIdnHostname } from './idn_hostname.ts'
import { IsIPv4 } from './ipv4.ts'
import { IsIPv6 } from './ipv6.ts'
import { IsIriReference } from './iri_reference.ts'
import { IsIri } from './iri.ts'
import { IsJsonPointerUriFragment } from './json_pointer_uri_fragment.ts'
import { IsJsonPointer } from './json_pointer.ts'
import { IsRegex } from './regex.ts'
import { IsRelativeJsonPointer } from './relative_json_pointer.ts'
import { IsTime } from './time.ts'
import { IsUriReference } from './uri_reference.ts'
import { IsUriTemplate } from './uri_template.ts'
import { IsUri } from './uri.ts'
import { IsUrl } from './url.ts'
import { IsUuid } from './uuid.ts'

// ------------------------------------------------------------------
// FormatCheckFunction
// ------------------------------------------------------------------
export type TFormatCheckFunction = (value: string) => boolean

// ------------------------------------------------------------------
// Standard
// ------------------------------------------------------------------
const standard: Record<string, TFormatCheckFunction> = {
  'date-time': IsDateTime,
  'date': IsDate,
  'duration': IsDuration,
  'email': IsEmail,
  'hostname': IsHostname,
  'idn-email': IsIdnEmail,
  'idn-hostname': IsIdnHostname,
  'ipv4': IsIPv4,
  'ipv6': IsIPv6,
  'iri-reference': IsIriReference,
  'iri': IsIri,
  'json-pointer-uri-fragment': IsJsonPointerUriFragment,
  'json-pointer': IsJsonPointer,
  'regex': IsRegex,
  'relative-json-pointer': IsRelativeJsonPointer,
  'time': IsTime,
  'uri-reference': IsUriReference,
  'uri-template': IsUriTemplate,
  'uri': IsUri,
  'url': IsUrl,
  'uuid': IsUuid
}
// ------------------------------------------------------------------
// IsStandardFormat
// ------------------------------------------------------------------
/** Returns true if the format is a built-in standard format */
export function IsStandardFormat(format: string): boolean {
  return format in standard
}
// ------------------------------------------------------------------
// Formats
// ------------------------------------------------------------------
const formats = new Map<string, TFormatCheckFunction>(Object.entries(standard))

// ------------------------------------------------------------------
// Entries
// ------------------------------------------------------------------
/** Returns format entries in this registry */
export function Entries(): [string, TFormatCheckFunction][] {
  return [...formats.entries()]
}
// ------------------------------------------------------------------
// Set
// ------------------------------------------------------------------
/** Sets a format */
export function Set(format: string, check: TFormatCheckFunction): void {
  if (formats.has(format)) throw new Error(`Format '${format}' is already registered`)
  formats.set(format, check)
}
// ------------------------------------------------------------------
// Has
// ------------------------------------------------------------------
/** Returns true if the registry has this format */
export function Has(format: string): boolean {
  return formats.has(format)
}
// ------------------------------------------------------------------
// Get
// ------------------------------------------------------------------
/** Gets a format or undefined if not exists */
export function Get(format: string): TFormatCheckFunction | undefined {
  return formats.get(format)
}
// ------------------------------------------------------------------
// Test
// ------------------------------------------------------------------
/** Tests a value against a format, if the format is not registered, true */
export function Test(format: string, value: string): boolean {
  return formats.get(format)?.(value) ?? true
}
// ------------------------------------------------------------------
// Reset
// ------------------------------------------------------------------
/** Resets all formats to defaults */
export function Reset(): void {
  formats.clear()
  for (const [format, check] of Object.entries(standard)) formats.set(format, check)
}
