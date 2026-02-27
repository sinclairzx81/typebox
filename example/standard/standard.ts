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

import { type Static, type TProperties, type TSchema } from 'typebox'
import { TLocalizedValidationError } from 'typebox/error'
import { Validator } from 'typebox/schema'
import { Arguments } from 'typebox/system'
import { Guard } from 'typebox/guard'

// ------------------------------------------------------------------
// Error to Issue
// ------------------------------------------------------------------
function PathSegments(pointer: string): string[] {
  if (Guard.IsEqual(pointer.length, 0)) return []
  return pointer.slice(1).split('/').map((segment) => segment.replace(/~1/g, '/').replace(/~0/g, '~'))
}
function Issue(error: TLocalizedValidationError): StandardSchemaV1.Issue {
  const path = PathSegments(error.instancePath)
  return { path, message: error.message }
}
// ------------------------------------------------------------------
// TStandardSchemaProps
// ------------------------------------------------------------------
export class StandardSchemaProps<Value> implements StandardSchemaV1.Props<Value, Value>, StandardJSONSchemaV1.Props<Value, Value> {
  public readonly validator: Validator
  public readonly vendor = 'typebox'
  public readonly version = 1
  public types?: StandardTypedV1.Types<Value, Value> | undefined
  public jsonSchema: StandardJSONSchemaV1.Converter
  constructor(context: TProperties, type: TSchema) {
    this.validator = new Validator(context, type)
    this.jsonSchema = {
      output: () => this.validator.Schema() as Record<string, unknown>,
      input: () => this.validator.Schema() as Record<string, unknown>
    }
  }
  public validate(value: unknown): StandardSchemaV1.Result<Value> | Promise<StandardSchemaV1.Result<Value>> {
    if (this.validator.Check(value)) return { value } as never
    const [_result, errors] = this.validator.Errors(value)
    const issues = errors.map((error) => Issue(error))
    return { issues }
  }
}
export class StandardSchema<Context extends TProperties, Type extends TSchema, out Value extends unknown = Static<Type, Context>> implements StandardSchemaV1<Value>, StandardJSONSchemaV1<Value> {
  '~standard': StandardSchemaV1.Props<Value, Value> & StandardJSONSchemaV1.Props<Value, Value>
  constructor(context: Context, type: Type) {
    this['~standard'] = new StandardSchemaProps(context, type)
  }
}
// ------------------------------------------------------------------
// Factory
// ------------------------------------------------------------------
/** Returns an implementation of Standard Schema + Standard JSON Schema */
export function StandardSchemaV1<const Type extends TSchema, Result = StandardSchema<{}, Type>>(type: Type): Result
/** Returns an implementation of Standard Schema + Standard JSON Schema */
export function StandardSchemaV1<Context extends TProperties, const Type extends TSchema, Result = StandardSchema<Context, Type>>(context: Context, type: Type): Result
/** Returns an implementation of Standard Schema + Standard JSON Schema */
export function StandardSchemaV1(...args: unknown[]): unknown {
  const [context, type] = Arguments.Match<[TProperties, TSchema]>(args, {
    2: (context, type) => [context, type],
    1: (type) => [{}, type]
  })
  return new StandardSchema(context, type)
}

// #########################
// ###   Standard Typed  ###
// #########################

/** The Standard Typed interface. This is a base type extended by other specs. */
export interface StandardTypedV1<Input = unknown, Output = Input> {
  /** The Standard properties. */
  readonly '~standard': StandardTypedV1.Props<Input, Output>
}

export declare namespace StandardTypedV1 {
  /** The Standard Typed properties interface. */
  export interface Props<Input = unknown, Output = Input> {
    /** The version number of the standard. */
    readonly version: 1
    /** The vendor name of the schema library. */
    readonly vendor: string
    /** Inferred types associated with the schema. */
    readonly types?: Types<Input, Output> | undefined
  }

  /** The Standard Typed types interface. */
  export interface Types<Input = unknown, Output = Input> {
    /** The input type of the schema. */
    readonly input: Input
    /** The output type of the schema. */
    readonly output: Output
  }

  /** Infers the input type of a Standard Typed. */
  export type InferInput<Schema extends StandardTypedV1> = NonNullable<
    Schema['~standard']['types']
  >['input']

  /** Infers the output type of a Standard Typed. */
  export type InferOutput<Schema extends StandardTypedV1> = NonNullable<
    Schema['~standard']['types']
  >['output']
}

// ##########################
// ###   Standard Schema  ###
// ##########################

/** The Standard Schema interface. */
export interface StandardSchemaV1<Input = unknown, Output = Input> {
  /** The Standard Schema properties. */
  readonly '~standard': StandardSchemaV1.Props<Input, Output>
}

export declare namespace StandardSchemaV1 {
  /** The Standard Schema properties interface. */
  export interface Props<Input = unknown, Output = Input> extends StandardTypedV1.Props<Input, Output> {
    /** Validates unknown input values. */
    readonly validate: (
      value: unknown,
      options?: StandardSchemaV1.Options | undefined
    ) => Result<Output> | Promise<Result<Output>>
  }
  /** The result interface of the validate function. */
  export type Result<Output> = SuccessResult<Output> | FailureResult
  /** The result interface if validation succeeds. */
  export interface SuccessResult<Output> {
    /** The typed output value. */
    readonly value: Output
    /** A falsy value for `issues` indicates success. */
    readonly issues?: undefined
  }
  export interface Options {
    /** Explicit support for additional vendor-specific parameters, if needed. */
    readonly libraryOptions?: Record<string, unknown> | undefined
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
  /** The Standard types interface. */
  export interface Types<Input = unknown, Output = Input> extends StandardTypedV1.Types<Input, Output> {}
  /** Infers the input type of a Standard. */
  export type InferInput<Schema extends StandardTypedV1> = StandardTypedV1.InferInput<Schema>
  /** Infers the output type of a Standard. */
  export type InferOutput<Schema extends StandardTypedV1> = StandardTypedV1.InferOutput<Schema>
}

// ###############################
// ###   Standard JSON Schema  ###
// ###############################

/** The Standard JSON Schema interface. */
export interface StandardJSONSchemaV1<Input = unknown, Output = Input> {
  /** The Standard JSON Schema properties. */
  readonly '~standard': StandardJSONSchemaV1.Props<Input, Output>
}
export declare namespace StandardJSONSchemaV1 {
  /** The Standard JSON Schema properties interface. */
  export interface Props<Input = unknown, Output = Input> extends StandardTypedV1.Props<Input, Output> {
    /** Methods for generating the input/output JSON Schema. */
    readonly jsonSchema: StandardJSONSchemaV1.Converter
  }

  /** The Standard JSON Schema converter interface. */
  export interface Converter {
    /** Converts the input type to JSON Schema. May throw if conversion is not supported. */
    readonly input: (
      options: StandardJSONSchemaV1.Options
    ) => Record<string, unknown>
    /** Converts the output type to JSON Schema. May throw if conversion is not supported. */
    readonly output: (
      options: StandardJSONSchemaV1.Options
    ) => Record<string, unknown>
  }

  /**
   * The target version of the generated JSON Schema.
   *
   * It is *strongly recommended* that implementers support `"draft-2020-12"` and `"draft-07"`, as they are both in wide use. All other targets can be implemented on a best-effort basis. Libraries should throw if they don't support a specified target.
   *
   * The `"openapi-3.0"` target is intended as a standardized specifier for OpenAPI 3.0 which is a superset of JSON Schema `"draft-04"`.
   */
  export type Target =
    | 'draft-2020-12'
    | 'draft-07'
    | 'openapi-3.0'
    // Accepts any string for future targets while preserving autocomplete
    | ({} & string)

  /** The options for the input/output methods. */
  export interface Options {
    /** Specifies the target version of the generated JSON Schema. Support for all versions is on a best-effort basis. If a given version is not supported, the library should throw. */
    readonly target: Target

    /** Explicit support for additional vendor-specific parameters, if needed. */
    readonly libraryOptions?: Record<string, unknown> | undefined
  }

  /** The Standard types interface. */
  export interface Types<Input = unknown, Output = Input> extends StandardTypedV1.Types<Input, Output> {}

  /** Infers the input type of a Standard. */
  export type InferInput<Schema extends StandardTypedV1> = StandardTypedV1.InferInput<Schema>

  /** Infers the output type of a Standard. */
  export type InferOutput<Schema extends StandardTypedV1> = StandardTypedV1.InferOutput<Schema>
}
