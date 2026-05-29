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

// deno-fmt-ignore-file

import { Memory } from '../../system/memory/index.ts'
import { type StaticType, type StaticDirection } from './static.ts'
import { type TSchema, type TSchemaOptions, IsKind } from './schema.ts'
import { type TProperties } from './properties.ts'

// ------------------------------------------------------------------
// Static
// ------------------------------------------------------------------
export type StaticIf<Stack extends string[], Direction extends StaticDirection, Context extends TProperties, This extends TProperties, If extends TSchema, Then extends TSchema, Else extends TSchema,
  StaticIf extends unknown = StaticType<Stack, Direction, Context, This, If>,
  StaticThen extends unknown = StaticType<Stack, Direction, Context, This, Then>,
  StaticElse extends unknown = StaticType<Stack, Direction, Context, This, Else>,
  Result extends unknown = (StaticIf & StaticThen) | Exclude<StaticElse, StaticIf>
> = Result
// ------------------------------------------------------------------
// Type
// ------------------------------------------------------------------
/** Represents a Conditionally Dependent If Type */
export interface TIf<If extends TSchema = TSchema, Then extends TSchema = TSchema, Else extends TSchema = TSchema> extends TSchema {
  '~kind': 'If'
  if: If
  then: Then
  else: Else
}
// ------------------------------------------------------------------
// Factory
// ------------------------------------------------------------------
/** Creates a Conditionally Dependent If Type */
export function If<If extends TSchema, Then extends TSchema, Else extends TSchema>(if_: If, then_: Then, else_: Else, options: TSchemaOptions = {}): TIf<If, Then, Else> {
  return Memory.Create({ '~kind': 'If' }, { if: if_, then: then_, else: else_ }, options) as never
}
// ------------------------------------------------------------------
// Guard
// ------------------------------------------------------------------
/** Returns true if the given value is TIf. */
export function IsIf(value: unknown): value is TIf {
  return IsKind(value, 'If')
}

// ------------------------------------------------------------------
// Options
// ------------------------------------------------------------------
/** Extracts options from a TIf. */
export function IfOptions(type: TIf): TSchemaOptions {
  return Memory.Discard(type, ['~kind', 'if', 'then', 'else'])
}