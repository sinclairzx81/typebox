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
import { Guard } from '../../guard/index.ts'
import { type TSchema, IsSchema } from '../types/schema.ts'

// ------------------------------------------------------------------
// Operator
// ------------------------------------------------------------------
/** Represents an operation to apply Readonly to a property. */
export interface TReadonlyAddAction<Type extends TSchema = TSchema> extends TSchema {
  '~kind': 'ReadonlyAddAction'
  type: Type
}
// ------------------------------------------------------------------
// Action
// ------------------------------------------------------------------
/** Creates a ReadonlyAddAction. */
export function ReadonlyAddAction<Type extends TSchema>(type: Type): TReadonlyAddAction<Type> {
  return Memory.Create({ ['~kind']: 'ReadonlyAddAction' }, { type }, {}) as never
}
// ------------------------------------------------------------------
// Guard
// ------------------------------------------------------------------
/** Returns true if this value is a ReadonlyAddAction. */
export function IsReadonlyAddAction(value: unknown): value is TReadonlyAddAction {
  return Guard.IsObject(value) 
    && Guard.HasPropertyKey(value, '~kind') 
    && Guard.HasPropertyKey(value, 'type') 
    && Guard.IsEqual(value['~kind'], 'ReadonlyAddAction')
    && IsSchema(value.type) 
}
// ------------------------------------------------------------------
// Type
// ------------------------------------------------------------------
/** Represents an action to remove Readonly from a property. */
export interface TReadonlyRemoveAction<Type extends TSchema = TSchema> extends TSchema {
  '~kind': 'ReadonlyRemoveAction'
  type: Type
}
// ------------------------------------------------------------------
// Factory
// ------------------------------------------------------------------
/** Creates a ReadonlyRemoveAction. */
export function ReadonlyRemoveAction<Type extends TSchema>(type: Type): TReadonlyRemoveAction<Type> {
  return Memory.Create({ ['~kind']: 'ReadonlyRemoveAction' }, { type }, {}) as never
}
// ------------------------------------------------------------------
// Guard
// ------------------------------------------------------------------
/** Returns true if this value is a ReadonlyRemoveAction. */
export function IsReadonlyRemoveAction(value: unknown): value is TReadonlyRemoveAction {
  return Guard.IsObject(value) 
    && Guard.HasPropertyKey(value, '~kind') 
    && Guard.HasPropertyKey(value, 'type') 
    && Guard.IsEqual(value['~kind'], 'ReadonlyRemoveAction')
    && IsSchema(value.type) 
}