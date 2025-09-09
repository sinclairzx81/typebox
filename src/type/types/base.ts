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

// --------------------------------------------------------
// TResult
// --------------------------------------------------------
type TResult<Value extends unknown = unknown> = TValue<Value> | TIssues
// --------------------------------------------------------
// TValue
// --------------------------------------------------------
interface TValue<Value extends unknown = unknown> {
  value: Value
}
function Value<Value>(value: Value): TValue<Value> {
  return { value }
}
// --------------------------------------------------------
// TIssues
// --------------------------------------------------------
interface TIssues {
  issues: object[]
}
function Issues(issues: object[]): TIssues {
  return { issues }
}
// ------------------------------------------------------------------------------------
// StandardValidatorV1
// ------------------------------------------------------------------------------------
class StandardValidatorV1<Value extends unknown = unknown> {
  public readonly vendor = 'typebox'
  public readonly version = 1
  constructor(
    private readonly check: (value: unknown) => boolean,
    private readonly errors: (value: unknown) => object[],
  ) { }
  public readonly validate = (value: unknown): TResult<Value> => {
    return (this.check(value)) ? Value(value as Value) : Issues(this.errors(value))
  }
}
// ------------------------------------------------------------------
// BaseError
// ------------------------------------------------------------------
export class BaseNotImplemented extends Error {
  constructor(type: Base, override: string) {
    // @ts-ignore - options supported in deno, node, etc.
    super(`Base type does not implement '${override}' function`, { cause: type })
  }
}
// ------------------------------------------------------------------
// Base
// ------------------------------------------------------------------
/** Base class for creating extension types. */
export class Base<Value extends unknown = unknown> implements TSchema {
  public readonly '~kind': 'Base'
  public readonly '~standard': StandardValidatorV1<Value>
  constructor() {
    const validator = new StandardValidatorV1(
      value => this.Check(value),
      value => this.Errors(value)
    )
    const configuration = {
      writable: false,
      configurable: false,
      enumerable: false
    }
    Object.defineProperty(this, '~kind', { ...configuration, value: 'Base', })
    Object.defineProperty(this, '~standard', { ...configuration, value: validator })
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