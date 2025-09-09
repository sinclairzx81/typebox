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
import { type TSchema, IsKind } from './schema.ts'
import { type TCallInstantiate, CallInstantiate } from '../engine/call/instantiate.ts'

// ------------------------------------------------------------------
// Type
// ------------------------------------------------------------------
/** Represents a deferred generic Call */
export interface TCall<Target extends TSchema = TSchema, Arguments extends TSchema[] = TSchema[]> extends TSchema {
  '~kind': 'Call'
  target: Target
  arguments: Arguments
}
// ------------------------------------------------------------------
// Construct
// ------------------------------------------------------------------
export type TCallConstruct<Target extends TSchema, Arguments extends TSchema[],
  Result extends TSchema = TCall<Target, Arguments>
> = Result

export function CallConstruct<Target extends TSchema, Arguments extends TSchema[]>
  (target: Target, arguments_: [...Arguments]): TCallConstruct<Target, Arguments> {
  return Memory.Create({ ['~kind']: 'Call' }, { target, arguments: arguments_ }, {}) as never
}
// ------------------------------------------------------------------
// Factory
// ------------------------------------------------------------------
/** Creates a Call type. */
export function Call<Target extends TSchema, Arguments extends TSchema[]>
  (target: Target, arguments_: [...Arguments]): 
    TCallInstantiate<{}, { callstack: [] }, Target, Arguments> {
  return CallInstantiate({}, { callstack: [] }, target, arguments_) as never
}
// ------------------------------------------------------------------
// Guard
// ------------------------------------------------------------------
/** Returns true if the given type is a TCall. */
export function IsCall(value: unknown): value is TCall {
  return IsKind(value, 'Call')
}