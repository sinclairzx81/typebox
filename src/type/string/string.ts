/*--------------------------------------------------------------------------

@sinclair/typebox/type

The MIT License (MIT)

Copyright (c) 2017-2024 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

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

import { CreateType } from '../create/type'
import { TSchema, SchemaOptions } from '../schema/index'
import { Kind } from '../symbols/index'

// ------------------------------------------------------------------
// StringFormatOption
// ------------------------------------------------------------------
export type StringFormatOption =
  | 'date-time'
  | 'date'
  | 'duration'
  | 'email'
  | 'hostname'
  | 'idn-email'
  | 'idn-hostname'
  | 'ipv4'
  | 'ipv6'
  | 'iri-reference'
  | 'iri'
  | 'json-pointer'
  | 'regex'
  | 'time'
  | 'uri-reference'
  | 'uri-template'
  | 'uri'
  | 'uuid'
  | ({} & string)
// prettier-ignore
export type StringContentEncodingOption =
  | '7bit'
  | '8bit'
  | 'binary'
  | 'quoted-printable'
  | 'base64'
  | ({} & string)
export interface StringOptions extends SchemaOptions {
  /** The maximum string length */
  maxLength?: number
  /** The minimum string length */
  minLength?: number
  /** A regular expression pattern this string should match */
  pattern?: string
  /** A format this string should match */
  format?: StringFormatOption
  /** The content encoding for this string */
  contentEncoding?: StringContentEncodingOption
  /** The content media type for this string */
  contentMediaType?: string
}
// ------------------------------------------------------------------
// TString
// ------------------------------------------------------------------
export interface TString extends TSchema, StringOptions {
  [Kind]: 'String'
  static: string
  type: 'string'
}
/** `[Standard]` Creates a String type */
export function String(options?: StringOptions): TString {
  return CreateType({ [Kind]: 'String', type: 'string' }, options) as never
}
