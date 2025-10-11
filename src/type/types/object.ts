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
import { type StaticDirection } from './static.ts'
import { type TSchema, type TObjectOptions, IsKind } from './schema.ts'
import { type TProperties, type TRequiredArray, type StaticProperties, RequiredArray } from './properties.ts'

// ------------------------------------------------------------------
// Static
// ------------------------------------------------------------------
export type StaticObject<Stack extends string[], Direction extends StaticDirection, Context extends TProperties, _This extends TProperties, Properties extends TProperties,
  Result = keyof Properties extends never ? object : StaticProperties<Stack, Direction, Context, Properties, Properties>
> = Result
// ------------------------------------------------------------------
// Schema
// ------------------------------------------------------------------
/** Represents an Object type. */
export interface TObject<Properties extends TProperties = TProperties> extends TSchema {
  '~kind': 'Object'
  type: 'object'
  properties: Properties
  required: TRequiredArray<Properties>
}
// ------------------------------------------------------------------
// Factory
// ------------------------------------------------------------------
/** Creates an Object type. */
function _Object_<Properties extends TProperties>(properties: Properties, options: TObjectOptions = {}): TObject<Properties> {
  const requiredKeys = RequiredArray(properties) as string[]
  const required = requiredKeys.length > 0 ? { required: requiredKeys } : {}
  return Memory.Create({ '~kind': 'Object' }, { type: 'object', ...required, properties }, options) as never
}
/** `[Json]` Creates an Object type */
export var Object = _Object_ // Required for CommonJS ES Interop

// ------------------------------------------------------------------
// Guard
// ------------------------------------------------------------------
/** Returns true if the given value is TObject. */
export function IsObject(value: unknown): value is TObject {
  return IsKind(value, 'Object')
}
// ------------------------------------------------------------------
// Options
// ------------------------------------------------------------------
/** Extracts options from a TObject. */
export function ObjectOptions(type: TObject): TObjectOptions {
  return Memory.Discard(type, ['~kind', 'type', 'properties', 'required'])
}

