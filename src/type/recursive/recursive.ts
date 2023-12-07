/*--------------------------------------------------------------------------

@sinclair/typebox/type

The MIT License (MIT)

Copyright (c) 2017-2023 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

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

import type { TSchema, SchemaOptions } from '../schema/index'
import { CloneType } from '../clone/type'
import { IsUndefined } from '../guard/value'
import { Kind, Hint } from '../symbols/index'
import { Static } from '../static/index'

// ------------------------------------------------------------------
// TThis
// ------------------------------------------------------------------
export interface TThis extends TSchema {
  [Kind]: 'This'
  static: this['params'][0]
  $ref: string
}
// ------------------------------------------------------------------
// RecursiveStatic
// ------------------------------------------------------------------
type RecursiveStatic<T extends TSchema> = Static<T, [RecursiveStatic<T>]>
// ------------------------------------------------------------------
// TRecursive
// ------------------------------------------------------------------
export interface TRecursive<T extends TSchema> extends TSchema {
  [Hint]: 'Recursive'
  static: RecursiveStatic<T>
}
// Auto Tracked For Recursive Types without ID's
let Ordinal = 0
/** `[Json]` Creates a Recursive type */
export function Recursive<T extends TSchema>(callback: (thisType: TThis) => T, options: SchemaOptions = {}): TRecursive<T> {
  if (IsUndefined(options.$id)) (options as any).$id = `T${Ordinal++}`
  const thisType = callback({ [Kind]: 'This', $ref: `${options.$id}` } as any)
  thisType.$id = options.$id
  // prettier-ignore
  return CloneType({ ...options, [Hint]: 'Recursive', ...thisType }) as unknown as TRecursive<T>
}
