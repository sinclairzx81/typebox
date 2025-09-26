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

import { IsKind, type TSchema } from './schema.ts'

// ------------------------------------------------------------------
// The Standard Schema interface, Do not export these interfaces
// ------------------------------------------------------------------
interface StandardSchemaV1<Input = unknown, Output = Input> {
  /** The Standard Schema properties. */
  readonly '~standard': StandardSchemaV1.Props<Input, Output>
}
declare namespace StandardSchemaV1 {
  /** The Standard Schema properties interface. */
  export interface Props<Input = unknown, Output = Input> {
    /** The version number of the standard. */
    readonly version: 1
    /** The vendor name of the schema library. */
    readonly vendor: string
    /** Validates unknown input values. */
    readonly validate: (
      value: unknown
    ) => Result<Output> | Promise<Result<Output>>
    /** Inferred types associated with the schema. */
    readonly types?: Types<Input, Output> | undefined
  }
  /** The result interface of the validate function. */
  export type Result<Output> = SuccessResult<Output> | FailureResult
  /** The result interface if validation succeeds. */
  export interface SuccessResult<Output> {
    /** The typed output value. */
    readonly value: Output
    /** The non-existent issues. */
    readonly issues?: undefined
  }
  /** The result interface if validation fails. */
  export interface FailureResult {
    /** The issues of failed validation. */
    readonly issues: ReadonlyArray<Issue>
  }
  /** The issue interface of the failure output. */
  export interface Issue {
    /** The error message of the issue. */
    readonly message: string
    /** The path of the issue, if any. */
    readonly path?: ReadonlyArray<PropertyKey | PathSegment> | undefined
  }
  /** The path segment interface of the issue. */
  export interface PathSegment {
    /** The key representing a path segment. */
    readonly key: PropertyKey
  }
  /** The Standard Schema types interface. */
  export interface Types<Input = unknown, Output = Input> {
    /** The input type of the schema. */
    readonly input: Input
    /** The output type of the schema. */
    readonly output: Output
  }
  /** Infers the input type of a Standard Schema. */
  export type InferInput<Schema extends StandardSchemaV1> = NonNullable<
    Schema['~standard']['types']
  >['input']
  /** Infers the output type of a Standard Schema. */
  export type InferOutput<Schema extends StandardSchemaV1> = NonNullable<
    Schema['~standard']['types']
  >['output']

  export {}
}

// --------------------------------------------------------
// Standard Schema Factory
// --------------------------------------------------------
function Value<Value>(value: Value): StandardSchemaV1.SuccessResult<Value> {
  return { value }
}
function Issues(issues: object[]): StandardSchemaV1.FailureResult {
  // We cannot guarantee that the caller will pass an object with an
  // error message, but it is generally implied. Additionally, we do
  // not want StandardSchema interfaces proliferating throughout the
  // codebase; they must remain contained within this module only.
  return { issues } as never
}
// ------------------------------------------------------------------------------------
// StandardValidatorV1
// ------------------------------------------------------------------------------------
class StandardValidatorV1<Value extends unknown = unknown> implements StandardSchemaV1.Props<Value> {
  public readonly vendor = 'typebox'
  public readonly version = 1
  constructor(
    private readonly check: (value: unknown) => boolean,
    private readonly errors: (value: unknown) => object[]
  ) {}
  public readonly validate = (value: unknown): StandardSchemaV1.Result<Value> => {
    return (this.check(value)) ? Value(value as Value) : Issues(this.errors(value)) as never
  }
}
// ------------------------------------------------------------------
// BaseError
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
// Base
// ------------------------------------------------------------------
/** Base class for creating extension types. */
export class Base<Value extends unknown = unknown> implements TSchema {
  public readonly '~kind': 'Base'
  public readonly '~standard': StandardSchemaV1.Props<Value>
  constructor() {
    const validator = new StandardValidatorV1(
      (value) => this.Check(value),
      (value) => this.Errors(value)
    )
    const configuration = {
      writable: false,
      configurable: false,
      enumerable: false
    }
    Object.defineProperty(this, '~kind', { ...configuration, value: 'Base' })
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
