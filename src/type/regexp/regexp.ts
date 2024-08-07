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
import type { SchemaOptions } from '../schema/index'
import type { TSchema } from '../schema/index'
import { IsString } from '../guard/value'
import { Kind } from '../symbols/index'

export interface RegExpOptions extends SchemaOptions {
  /** The maximum length of the string */
  maxLength?: number
  /** The minimum length of the string */
  minLength?: number
}
export interface TRegExp extends TSchema {
  [Kind]: 'RegExp'
  static: `${string}`
  type: 'RegExp'
  source: string
  flags: string
}

/** `[JavaScript]` Creates a RegExp type */
export function RegExp(pattern: string, options?: RegExpOptions): TRegExp
/** `[JavaScript]` Creates a RegExp type */
export function RegExp(regex: RegExp, options?: RegExpOptions): TRegExp
/** `[JavaScript]` Creates a RegExp type */
export function RegExp(unresolved: RegExp | string, options?: RegExpOptions) {
  const expr = IsString(unresolved) ? new globalThis.RegExp(unresolved) : unresolved
  return CreateType({ [Kind]: 'RegExp', type: 'RegExp', source: expr.source, flags: expr.flags }, options) as never
}
