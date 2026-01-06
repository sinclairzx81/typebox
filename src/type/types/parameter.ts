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
import { type TSchema, IsKind } from './schema.ts'
import { type TUnknown, Unknown } from './unknown.ts'

// ------------------------------------------------------------------
// Type
// ------------------------------------------------------------------
/** Represents a Generic parameter. */
export interface TParameter<Name extends string = string, Extends extends TSchema = TSchema, Equals extends TSchema = TSchema> extends TSchema {
  '~kind': 'Parameter'
  name: Name
  extends: Extends
  equals: Equals
}
// ------------------------------------------------------------------
// Type
// ------------------------------------------------------------------
/** Creates a Parameter type. */
export function Parameter<Name extends string, Extends extends TSchema, Equals extends TSchema>(name: Name, extends_: Extends, equals: Equals): TParameter<Name, Extends, Equals>
/** Creates a Parameter type. */
export function Parameter<Name extends string, Extends extends TSchema, Equals extends TSchema>(name: Name, extends_: Extends): TParameter<Name, Extends, Extends>
/** Creates a Parameter type. */
export function Parameter<Name extends string>(name: Name): TParameter<Name, TUnknown, TUnknown>
/** Creates a Parameter type. */
export function Parameter(...args: unknown[]): any {
  const [name, extends_, equals] = Arguments.Match<[string, TSchema, TSchema]>(args, {
    3: (name, extends_, equals) => [name, extends_, equals],
    2: (name, extends_) => [name, extends_, extends_],
    1: (name) => [name, Unknown(), Unknown()],
  })
  return Memory.Create({ '~kind': 'Parameter' }, { name, extends: extends_, equals }, {}) as never
}
// ------------------------------------------------------------------
// Guard
// ------------------------------------------------------------------
/** Returns true if the given value is TParameter. */
export function IsParameter(value: unknown): value is TParameter {
  return IsKind(value, 'Parameter')
}