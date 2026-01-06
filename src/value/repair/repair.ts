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
import type { TProperties, TSchema, Static } from '../../type/index.ts'
import { FromType } from './from-type.ts'
import { Assert } from '../assert/index.ts'

/**
 * Repairs a value to match the provided type. This function is intended for data migration 
 * scenarios where existing values need to be migrating to an updated type. This function will
 * repair partially mismatched values by populating missing sub-properties and elements with 
 * default structures derived from the type. If the value already conforms to the type, no 
 * action is performed.
 */
export function Repair<const Type extends TSchema, 
  Result extends unknown = Static<Type>
>(type: Type, value: unknown): Result

/**
 * Repairs a value to match the provided type. This function is intended for data migration 
 * scenarios where existing values need to be migrating to an updated type. This function will
 * repair partially mismatched values by populating missing sub-properties and elements with 
 * default structures derived from the type. If the value already conforms to the type, no 
 * action is performed.
 */
export function Repair<Context extends TProperties, const Type extends TSchema, 
  Result extends unknown = Static<Type, Context>
>(context: Context, type: Type, value: unknown): Result

/**
 * Repairs a value to match the provided type. This function is intended for data migration 
 * scenarios where existing values need to be migrating to an updated type. This function will
 * repair partially mismatched values by populating missing sub-properties and elements with 
 * default structures derived from the type. If the value already conforms to the type, no 
 * action is performed.
 */
export function Repair(...args: unknown[]): unknown {
  const [context, type, value] = Arguments.Match<[TProperties, TSchema, unknown]>(args, {
    3: (context, type, value) => [context, type, value],
    2: (type, value) => [{}, type, value],
  })
  const repaired = FromType(context, type, value)
  Assert(context, type, repaired)
  return repaired
}