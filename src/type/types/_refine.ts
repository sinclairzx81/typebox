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

import { Arguments } from '../../system/arguments/index.ts'
import { Memory } from '../../system/memory/index.ts'
import { Guard } from '../../guard/index.ts'
import { type TSchema, IsSchema } from './schema.ts'
import { type Static } from './static.ts'

// ------------------------------------------------------------------
// RefineAdd
// ------------------------------------------------------------------
/** Applies a Refine check to the given type. */
export type TRefineAdd<Type extends TSchema = TSchema> = (
  '~refine' extends keyof Type ? Type : TRefine<Type>
)
/** Applies a Refine check to the given type. */
export function RefineAdd<Type extends TSchema>(type: Type, refinement: TRefinement<Type>): TRefineAdd<Type> {
  const refinements = IsRefine(type) ? [...type['~refine'], refinement] : [refinement]
  return Memory.Update(type, { '~refine': refinements }, { }) as never
}
// ------------------------------------------------------------------
// Type
// ------------------------------------------------------------------
/** Represents a type with embedded Refine check. */
export type TRefine<Type extends TSchema = TSchema> = (
  Type & { '~refine': TRefinement<unknown>[] }
)
// ------------------------------------------------------------------
// Factory
// ------------------------------------------------------------------
export type TRefineCheckCallback<Value extends unknown = unknown> = (value: Value) => boolean
export type TRefineErrorCallback<Value extends unknown = unknown> = (value: Value) => string

export interface TRefinement<Value extends unknown = unknown> {
  check: TRefineCheckCallback<Value>
  error: TRefineErrorCallback<Value>
}

/** Refines a type with an explicit check */
export function Refine<Type extends TSchema, Value = Static<Type>>(type: Type, check: TRefineCheckCallback<Value>, error: TRefineErrorCallback<Value>): TRefineAdd<Type>
/** Refines a type with an explicit check */
export function Refine<Type extends TSchema, Value = Static<Type>>(type: Type, check: TRefineCheckCallback<Value>): TRefineAdd<Type>
/** Refines a type with an explicit check */
export function Refine(...args: unknown[]): unknown {
  const [type, check, error] = Arguments.Match<[TSchema, TRefineCheckCallback, TRefineErrorCallback]>(args, {
    3: (type, check, error) => [type, check, error],
    2: (type, check) => [type, check, () => 'Refine Error'],
  })
  return RefineAdd(type, { check, error }) as never
}
// ------------------------------------------------------------------
// Guard
// ------------------------------------------------------------------
/** Returns true if the given value is a TRefinement. */
export function IsRefinement(value: unknown): value is TRefinement {
  return Guard.IsObjectNotArray(value)
    && Guard.HasPropertyKey(value, 'check')
    && Guard.HasPropertyKey(value, 'error')
    && Guard.IsFunction(value.check)
    && Guard.IsFunction(value.error)
}
/** Returns true if the given value is a TRefine. */
export function IsRefine(value: unknown): value is TRefine {
  return IsSchema(value) 
    && Guard.HasPropertyKey(value, '~refine') 
    && Guard.IsArray(value['~refine'])
    && Guard.Every(value['~refine'], 0, value => IsRefinement(value))
}

