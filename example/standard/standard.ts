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

import { TLocalizedValidationError } from 'typebox/error'
import { Validator } from 'typebox/compile'
import { Arguments } from 'typebox/system'
import Guard from 'typebox/guard'
import Type from 'typebox'

// ------------------------------------------------------------------
// Issues
// ------------------------------------------------------------------
function PathSegments(pointer: string): string[] {
  if (Guard.IsEqual(pointer.length, 0)) return []
  return pointer.slice(1).split("/").map(segment => segment.replace(/~1/g, "/").replace(/~0/g, "~"))
}
function Issue(error: TLocalizedValidationError): StandardSchemaV1.Issue {
  const path = PathSegments(error.instancePath)
  return { path, message: error.message  }
}
// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------
export class TStandardSchemaProps<Value> implements StandardSchemaV1.Props<Value, Value> {
  public readonly vendor = 'typebox'
  public readonly version = 1
  public readonly validator: Validator
  constructor(context: Type.TProperties, type: Type.TSchema) {
    this.validator = new Validator(context, type)
  }
  public validate(value: unknown): StandardSchemaV1.Result<Value> | Promise<StandardSchemaV1.Result<Value>> {
    if(this.validator.Check(value)) return { value } as never
    const errors = this.validator.Errors(value)
    const issues = errors.map(error => Issue(error))
    return { issues }
  }
}
export class TStandardSchema<Context extends Type.TProperties, Type extends Type.TSchema,
  Value = Type.Static<Type, Context>
> implements StandardSchemaV1<Value> {
  "~standard": StandardSchemaV1.Props<Value, Value>
  constructor(context: Context, type: Type) {
    this['~standard'] = new TStandardSchemaProps(context, type)
  }
}
// ------------------------------------------------------------------
// Factory
// ------------------------------------------------------------------
export function StandardSchemaV1<const Type extends Type.TSchema, 
  Result = TStandardSchema<{}, Type>
>(type: Type): Result
export function StandardSchemaV1<Context extends Type.TProperties, const Type extends Type.TSchema, 
  Result = TStandardSchema<Context, Type>
>(context: Context, type: Type): Result

export function StandardSchemaV1(...args: unknown[]): unknown {
  const [context, type] = Arguments.Match<[Type.TProperties, Type.TSchema]>(args, {
    2: (context, type) => [context, type],
    1: (type) => [{}, type]
  })
  return new TStandardSchema(context, type)
}

// ------------------------------------------------------------------
// Default
// ------------------------------------------------------------------
export default StandardSchemaV1

// ------------------------------------------------------------------
// Standard Schema Interface
// ------------------------------------------------------------------
export interface StandardSchemaV1<Input = unknown, Output = Input> {
  readonly "~standard": StandardSchemaV1.Props<Input, Output>;
}
export declare namespace StandardSchemaV1 {
  export interface Props<Input = unknown, Output = Input> {
    readonly version: 1;
    readonly vendor: string;
    readonly validate: (
      value: unknown,
    ) => Result<Output> | Promise<Result<Output>>;
    readonly types?: Types<Input, Output> | undefined;
  }
  export type Result<Output> = SuccessResult<Output> | FailureResult;
  export interface SuccessResult<Output> {
    readonly value: Output;
    readonly issues?: undefined;
  }
  export interface FailureResult {
    readonly issues: ReadonlyArray<Issue>;
  }
  export interface Issue {
    readonly message: string;
    readonly path?: ReadonlyArray<PropertyKey | PathSegment> | undefined;
  }
  export interface PathSegment {
    readonly key: PropertyKey;
  }
  export interface Types<Input = unknown, Output = Input> {
    readonly input: Input;
    readonly output: Output;
  }
  export type InferInput<Schema extends StandardSchemaV1> = NonNullable<
    Schema["~standard"]["types"]
  >["input"];
  export type InferOutput<Schema extends StandardSchemaV1> = NonNullable<
    Schema["~standard"]["types"]
  >["output"];
  export {};
}