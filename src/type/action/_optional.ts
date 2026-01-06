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
/** Represents a operation to apply Optional to a property */
export interface TOptionalAddAction<Type extends TSchema = TSchema> extends TSchema {
  '~kind': 'OptionalAddAction'
  type: Type
}
// ------------------------------------------------------------------
// Action
// ------------------------------------------------------------------
/** Creates an OptionalAddAction. */
export function OptionalAddAction<Type extends TSchema>(type: Type): TOptionalAddAction<Type> {
  return Memory.Create({ ['~kind']: 'OptionalAddAction' }, { type }, {}) as never
}
// ------------------------------------------------------------------
// Guard
// ------------------------------------------------------------------
/** Returns true if this value is a OptionalAddAction. */
export function IsOptionalAddAction(value: unknown): value is TOptionalAddAction {
  return Guard.IsObject(value) 
    && Guard.HasPropertyKey(value, '~kind') 
    && Guard.HasPropertyKey(value, 'type') 
    && Guard.IsEqual(value['~kind'], 'OptionalAddAction')
    && IsSchema(value.type) 
}
// ------------------------------------------------------------------
// Type
// ------------------------------------------------------------------
/** Represents a operation to remove Optional from a property */
export interface TOptionalRemoveAction<Type extends TSchema = TSchema> extends TSchema {
  '~kind': 'OptionalRemoveAction'
  type: Type
}
// ------------------------------------------------------------------
// Factory
// ------------------------------------------------------------------
/** Creates a OptionalRemoveAction. */
export function OptionalRemoveAction<Type extends TSchema>(type: Type): TOptionalRemoveAction<Type> {
  return Memory.Create({ ['~kind']: 'OptionalRemoveAction' }, { type }, {}) as never
}
// ------------------------------------------------------------------
// Guard
// ------------------------------------------------------------------
/** Returns true if this value is a OptionalRemoveAction. */
export function IsOptionalRemoveAction(value: unknown): value is TOptionalRemoveAction {
  return Guard.IsObject(value) 
    && Guard.HasPropertyKey(value, '~kind') 
    && Guard.HasPropertyKey(value, 'type') 
    && Guard.IsEqual(value['~kind'], 'OptionalRemoveAction')
    && IsSchema(value.type) 
}