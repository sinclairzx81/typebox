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

import { type TSchema, IsKind } from './schema.ts'
import { type XBase, type XBaseValidator } from '../../schema/types/index.ts'

// ------------------------------------------------------------------
// BaseNotImplemented
// ------------------------------------------------------------------
export class BaseNotImplemented extends Error {
  declare readonly cause: { type: Base; method: string }
  constructor(type: Base, method: string) {
    super(`Base type does not implement the '${method}' function`)
    Object.defineProperty(this, 'cause', {
      value: { type, method },
      writable: false,
      configurable: false,
      enumerable: false
    })
  }
}
// ------------------------------------------------------------------
// Type.Base<...>
// ------------------------------------------------------------------
/** Base class for creating extension types. */
export class Base<Value extends unknown = unknown> implements TSchema, XBase<Value> {
  public readonly '~kind': 'Base'
  public readonly '~base': BaseValidator<Value>
  constructor() {
    const validator = new BaseValidator(
      (value) => this.Check(value),
      (value) => this.Errors(value)
    )
    const configuration = {
      writable: false,
      configurable: false,
      enumerable: false
    }
    Object.defineProperty(this, '~kind', { ...configuration, value: 'Base' })
    Object.defineProperty(this, '~base', { ...configuration, value: validator })
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
    throw new BaseNotImplemented(this, 'Create')
  }
}
// ------------------------------------------------------------------
// Guard
// ------------------------------------------------------------------
/** Returns true if the given value is a Base type. */
export function IsBase(value: unknown): value is Base {
  return IsKind(value, 'Base')
}
// ------------------------------------------------------------------
// BaseValidator
// ------------------------------------------------------------------
class BaseValidator<Value extends unknown = unknown> implements XBaseValidator<Value> {
  constructor(
    public readonly check: (value: unknown) => value is Value,
    public readonly errors: (value: unknown) => object[]
  ) { }
}