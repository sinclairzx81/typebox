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
import { type TTuple } from './tuple.ts'
import { type TInstantiate } from '../engine/instantiate.ts'

// ------------------------------------------------------------------
// StaticInstantiatedParameters
//
// Parameters may contain embedded Rest elements. TypeBox does not
// auto Instantiate Rest on Function and Constructor types as Rest 
// encodes meaningful information about the signature. The following 
// performs a deferred Static Instantiate for inference only.
//
// ------------------------------------------------------------------
export type StaticInstantiatedParameters<Stack extends string[], Direction extends StaticDirection, Context extends TProperties, This extends TProperties, Parameters extends TSchema[], 
  Evaluated extends TSchema = TInstantiate<Context, TTuple<Parameters>>,
  Static extends unknown = StaticType<Stack, Direction, Context, This, Evaluated>,
  Result extends unknown[] = Static extends unknown[] ? Static : []
> = Result

// ------------------------------------------------------------------
// Static
// ------------------------------------------------------------------
export type StaticFunction<Stack extends string[], Direction extends StaticDirection, Context extends TProperties, This extends TProperties, Parameters extends TSchema[], ReturnType extends TSchema, 
  StaticParameters extends unknown[] = StaticInstantiatedParameters<Stack, Direction, Context, This, Parameters>,
  StaticReturnType extends unknown = StaticType<Stack, Direction, Context, This, ReturnType>,
  Result = (...args: StaticParameters) => StaticReturnType
> = Result
// ------------------------------------------------------------------
// Type
// ------------------------------------------------------------------
/** Represents a Function type. */
export interface TFunction<Parameters extends TSchema[] = TSchema[], ReturnType extends TSchema = TSchema> extends TSchema {
  '~kind': 'Function'
  type: 'function'
  parameters: Parameters
  returnType: ReturnType
}
// ------------------------------------------------------------------
// Factory
// ------------------------------------------------------------------
/** Creates a Function type. */
export function Function<Parameters extends TSchema[], ReturnType extends TSchema>(parameters: [...Parameters], returnType: ReturnType, options: TSchemaOptions = {}): TFunction<Parameters, ReturnType> {
  return Memory.Create({ ['~kind']: 'Function' }, { type: 'function', parameters, returnType }, options) as never
}
// ------------------------------------------------------------------
// Guard
// ------------------------------------------------------------------
/** Returns true if the given value is TFunction. */
export function IsFunction(value: unknown): value is TFunction {
  return IsKind(value, 'Function')
}
// ------------------------------------------------------------------
// Options
// ------------------------------------------------------------------
/** Extracts options from a TFunction. */
export function FunctionOptions(type: TFunction): TSchemaOptions {
  return Memory.Discard(type, ['~kind', 'type', 'parameters', 'returnType'])
}