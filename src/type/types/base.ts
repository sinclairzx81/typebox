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

import { type TLocalizedValidationError, type TStandardSchemaV1Error, type TValidationErrorBase, IsLocalizedValidationError } from '../../error/index.ts'
import { Guard } from '../../guard/index.ts'
import { type TSchema, IsKind } from './schema.ts'

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
// ------------------------------------------------------------------------------------
// BaseValidator
// ------------------------------------------------------------------------------------
class BaseValidator<Value extends unknown = unknown> implements StandardSchemaV1.Props<Value> {
  public readonly vendor = 'typebox'
  public readonly version = 1
  constructor(
    private readonly check: (value: unknown) => boolean,
    private readonly errors: (value: unknown) => object[]
  ) { }
  public readonly validate = (value: unknown): StandardSchemaV1.Result<Value> => {
    return this.check(value)
      ? this.Success(value as Value)
      : this.Failure(this.errors(value))
  }
  private Success(value: Value): StandardSchemaV1.SuccessResult<Value> {
    return { value }
  }
  private Failure(errors: object[]): StandardSchemaV1.FailureResult {
    const issues = errors.reduce<StandardSchemaV1.Issue[]>((result, error) => 
      [...result, ...CreateIssues(error)], [])
    return { issues } as never
  }
}
// ------------------------------------------------------------------
// Type
// ------------------------------------------------------------------
/** Base class for creating extension types. */
export class Base<Value extends unknown = unknown> implements TSchema {
  public readonly '~kind': 'Base'
  public readonly '~standard': StandardSchemaV1.Props<Value>
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
// --------------------------------------------------------
// StandardSchema: PathSegments
// --------------------------------------------------------
function PathSegments(pointer: string): string[] {
  if (Guard.IsEqual(pointer.length, 0)) return []
  return pointer.slice(1).split("/").map(segment => segment.replace(/~1/g, "/").replace(/~0/g, "~"))
}
// --------------------------------------------------------
// IsStandardSchemaV1Error
// --------------------------------------------------------
function IsStandardSchemaV1Error(error: TValidationErrorBase): error is TStandardSchemaV1Error {
  return Guard.IsEqual(error.keyword, '~standard')
}
// --------------------------------------------------------
// IssuesFromLocalizedError
// --------------------------------------------------------
function IssuesFromStandardSchemaV1Error(error: TStandardSchemaV1Error): StandardSchemaV1.Issue[] {
  const leading = PathSegments(error.instancePath)
  const issues = Guard.IsArray(error.params.issues) ? error.params.issues : []
  return issues.map(issue => {
    const message = Guard.IsString(issue.message) ? issue.message : 'unknown'
    const path = Guard.IsArray(issue.path) ? [...leading, ...issue.path] : leading
    return { message, path }
  })
}
function IssuesFromRegularError(error: TLocalizedValidationError): StandardSchemaV1.Issue[] {
  const path = PathSegments(error.instancePath)
  return [{ path, message: error.message  }]
}
function IssuesFromLocalizedError(error: TLocalizedValidationError): StandardSchemaV1.Issue[] {
  return IsStandardSchemaV1Error(error) 
    ? IssuesFromStandardSchemaV1Error(error) 
    : IssuesFromRegularError(error)
}
// --------------------------------------------------------
// IssuesFromUnknown
// --------------------------------------------------------
function IssuesFromUnknown(error: object): StandardSchemaV1.Issue[] {
  const path = Guard.HasPropertyKey(error, 'path') && Guard.IsArray(error.path) && error.path.every(segment => Guard.IsString(segment)) ? error.path : []
  const message = Guard.HasPropertyKey(error, 'message') && Guard.IsString(error.message) ? error.message : 'unknown'
  return [{ path, message }]
}
// --------------------------------------------------------
// CreateIssues
// --------------------------------------------------------
function CreateIssues(error: object): StandardSchemaV1.Issue[] {
  return IsLocalizedValidationError(error)
    ? IssuesFromLocalizedError(error)
    : IssuesFromUnknown(error)
}
// ------------------------------------------------------------------
// Standard Schema Interface
// ------------------------------------------------------------------
interface StandardSchemaV1<Input = unknown, Output = Input> {
  readonly '~standard': StandardSchemaV1.Props<Input, Output>
}
declare namespace StandardSchemaV1 {
  export interface Props<Input = unknown, Output = Input> {
    readonly version: 1
    readonly vendor: string
    readonly validate: (
      value: unknown
    ) => Result<Output> | Promise<Result<Output>>
    readonly types?: Types<Input, Output> | undefined
  }
  export type Result<Output> = SuccessResult<Output> | FailureResult
  export interface SuccessResult<Output> {
    readonly value: Output
    readonly issues?: undefined
  }
  export interface FailureResult {
    readonly issues: ReadonlyArray<Issue>
  }
  export interface Issue {
    readonly message: string
    readonly path?: ReadonlyArray<PropertyKey | PathSegment> | undefined
  }
  export interface PathSegment {
    readonly key: PropertyKey
  }
  export interface Types<Input = unknown, Output = Input> {
    readonly input: Input
    readonly output: Output
  }
  export type InferInput<Schema extends StandardSchemaV1> = NonNullable<
    Schema['~standard']['types']
  >['input']
  export type InferOutput<Schema extends StandardSchemaV1> = NonNullable<
    Schema['~standard']['types']
  >['output']
  export { }
}