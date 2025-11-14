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

import { Settings } from '../../system/settings/index.ts'
import { type TSchema, IsKind } from './schema.ts'
import { type XGuard, type XGuardInterface } from '../../schema/types/index.ts'

// ------------------------------------------------------------------
// StaticBase
// ------------------------------------------------------------------
export type StaticBase<Value extends unknown> = Value

// ------------------------------------------------------------------
// Type.Base<...>
// ------------------------------------------------------------------
function BaseProperty<Value>(value: Value): PropertyDescriptor {
  return {
    enumerable: Settings.Get().enumerableKind,
    writable: false,
    configurable: false,
    value
  }
}
/** Base class for creating extension types. */
export class Base<Value extends unknown = unknown> implements TSchema, XGuard<Value> {
  // Engine Assignable
  // public '~immutable'?: true
  // public '~readonly'?: true
  // public '~optional'?: true

  public readonly '~kind': 'Base'
  public readonly '~guard': XGuardInterface<Value>
  constructor() {
    globalThis.Object.defineProperty(this, '~kind', BaseProperty('Base'))
    globalThis.Object.defineProperty(this, '~guard', BaseProperty<XGuardInterface<Value>>({
      check: (value): value is Value => this.Check(value),
      errors: (value) => this.Errors(value)
    }))
  }
  /** Checks a value or returns false if invalid */
  public Check(value: unknown): value is Value {
    return true
  }
  /** Returns errors for a value. Return an empty array if valid.  */
  public Errors(value: unknown): object[] {
    return []
  }
  /** Converts a value into this type */
  public Convert(value: unknown): unknown {
    return value
  }
  /** Cleans a value according to this type */
  public Clean(value: unknown): unknown {
    return value
  }
  /** Returns a default value for this type */
  public Default(value: unknown): unknown {
    return value
  }
  /** Creates a new instance of this type */
  public Create(): Value {
    throw new Error('Create not implemented')
  }
  /** Clones this type  */
  public Clone(): Base {
    throw Error('Clone not implemented')
  }
}
// ------------------------------------------------------------------
// Guard
// ------------------------------------------------------------------
/** Returns true if the given value is a Base type. */
export function IsBase(value: unknown): value is Base {
  return IsKind(value, 'Base')
}