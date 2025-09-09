/*--------------------------------------------------------------------------

TypeBox

The MIT License (MIT)

Copyright (c) 2017-2025 Haydn Paterson 

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

// deno-fmt-ignore-file

import { Memory } from '../../system/memory/index.ts'
import { type StaticType, type StaticDirection } from './static.ts'
import { type TSchema, type TSchemaOptions, IsKind } from './schema.ts'
import { type TProperties } from './properties.ts'

// ------------------------------------------------------------------
// Static
// ------------------------------------------------------------------
export type StaticRef<Direction extends StaticDirection, Context extends TProperties, This extends TProperties, Ref extends string, 
  Result extends unknown = Ref extends keyof Context ? StaticType<Direction, Context, This, Context[Ref]> : unknown
> = Result
// ------------------------------------------------------------------
// Type
// ------------------------------------------------------------------
/** Represents a type reference. */
export interface TRef<Ref extends string = string> extends TSchema {
  '~kind': 'Ref'
  $ref: Ref
}
// ------------------------------------------------------------------
// Factory
// ------------------------------------------------------------------
/** Creates a Ref type. */
export function Ref<Ref extends string>(ref: Ref, options?: TSchemaOptions): TRef<Ref> {
  return Memory.Create({ ['~kind']: 'Ref' }, { $ref: ref }, options) as never
}
// ------------------------------------------------------------------
// Guard
// ------------------------------------------------------------------
/** Returns true if the given value is TRef. */
export function IsRef(value: unknown): value is TRef {
  return IsKind(value, 'Ref')
}