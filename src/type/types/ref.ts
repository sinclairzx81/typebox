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
import { type TObject } from './object.ts'
import { type TUnknown } from './unknown.ts'

// ------------------------------------------------------------------
//
// CyclicGuard
//
// This Guard checks if a given Ref already exists in the Stack,
// indicating recursion. If recursion is found, it ensures the Stack
// length remains below a safe threshold. 
//
// The purpose is to allow recursive types to instantiate up to a
// reasonable depth (for user feedback) while preventing unbounded
// recursion. 
//
// Note: This Guard is only needed for non-Object types, since
// TypeScript automatically defers inference for referential
// mapped property types.
//
// ------------------------------------------------------------------
type CyclicStackLength<Stack extends unknown[], MaxLength extends number, Buffer extends unknown[] = []> = (
  Stack extends [infer Left, ...infer Right]
    ? Buffer['length'] extends MaxLength
      ? false 
      : CyclicStackLength<Right, MaxLength, [...Buffer, Left]>
    : true
)
type CyclicGuard<Stack extends unknown[], Ref extends string> = (
  Ref extends Stack[number] ? CyclicStackLength<Stack, 2> : true
)

// ------------------------------------------------------------------
// StaticRef
//
// The inference Stack is appended only when encountering a Ref. If the
// referenced target is a TObject, the Stack is reset, and TypeScript's
// built-in inference deferral for referential property types applies.
//
// In all other cases, the Ref is pushed onto the Stack and checked
// with CyclicGuard to ensure recursion is terminated based on the
// CyclicGuard heuristic. Terminated recursion defaults to Any as an
// approximation of the expansive type.
//
// ------------------------------------------------------------------
type StaticGuardedRef<Stack extends string[], Direction extends StaticDirection, Context extends TProperties, This extends TProperties, Ref extends string, Type extends TSchema> = (
  CyclicGuard<Stack, Ref> extends true
    ? StaticType<[...Stack, Ref], Direction, Context, This, Type>
    : any
)
export type StaticRef<Stack extends string[], Direction extends StaticDirection, Context extends TProperties, This extends TProperties, Ref extends string,
  Target extends TSchema = Ref extends keyof Context ? Context[Ref] : TUnknown,
  Result extends unknown = Target extends TObject
    ? StaticType<[/* Reset */], Direction, Context, This, Target>
    : StaticGuardedRef<Stack, Direction, Context, This, Ref, Target>
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