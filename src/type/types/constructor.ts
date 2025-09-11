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
import { type StaticInstantiatedParameters } from './function.ts'
import { type TProperties } from './properties.ts'

// ------------------------------------------------------------------
// Static
// ------------------------------------------------------------------
export type StaticConstructor<Direction extends StaticDirection, Context extends TProperties, This extends TProperties, Parameters extends TSchema[], InstanceType extends TSchema,
  StaticParameters extends unknown[] = StaticInstantiatedParameters<Direction, Context, This, Parameters>,
  StaticReturnType extends unknown = StaticType<Direction, Context, This, InstanceType>,
  Result = new (...args: StaticParameters) => StaticReturnType
> = Result
// ------------------------------------------------------------------
// Type
// ------------------------------------------------------------------
/** Represents a Constructor type. */
export interface TConstructor<Parameters extends TSchema[] = TSchema[], InstanceType extends TSchema = TSchema> extends TSchema {
  '~kind': 'Constructor'
  type: 'constructor'
  parameters: Parameters
  instanceType: InstanceType
}
// ------------------------------------------------------------------
// Factory
// ------------------------------------------------------------------
/** Creates a Constructor type. */
export function Constructor<Parameters extends TSchema[], InstanceType extends TSchema>(parameters: [...Parameters], instanceType: InstanceType, options: TSchemaOptions = {}): TConstructor<Parameters, InstanceType> {
  return Memory.Create({ '~kind': 'Constructor' }, { type: 'constructor', parameters, instanceType }, options) as never
}
// ------------------------------------------------------------------
// Guard
// ------------------------------------------------------------------
/** Returns true if the given value is a TConstructor. */
export function IsConstructor(value: unknown): value is TConstructor {
  return IsKind(value, 'Constructor')
}
// ------------------------------------------------------------------
// Options
// ------------------------------------------------------------------
/** Extracts options from a TConstructor. */
export function ConstructorOptions(type: TConstructor): TSchemaOptions {
  return Memory.Discard(type, ['~kind', 'type', 'parameters', 'instanceType'])
}