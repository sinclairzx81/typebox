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
// deno-lint-ignore-file

import { Arguments } from '../system/arguments/index.ts'
import { type TLocalizedValidationError } from '../error/index.ts'
import * as Build from './build.ts'
import * as Schema from './types/index.ts'
import * as Static from './static/index.ts'
import { Errors } from './errors.ts'
import { ParseError } from './parse.ts'

// ------------------------------------------------------------------
// Validator
// ------------------------------------------------------------------
export class Validator<Schema extends Schema.XSchema, Value extends unknown = Static.XStatic<Schema>>  {
  private readonly build: Build.BuildResult
  private readonly result: Build.EvaluateResult
  constructor(context: Record<string, Schema.XSchema>, schema: Schema) {
    this.build = Build.Build(context, schema)
    this.result = this.build.Evaluate()
  }
  /** Checks this value is valid */
  public Check(value: unknown): value is Value {
    return this.result.Check(value)
  }
  /** Parses this value and throw if invalid */
  public Parse(value: unknown): Value {
    if(this.result.Check(value)) return value as never
    const [_result, errors] = Errors(this.build.Context(), this.build.Schema(), value)
    throw new ParseError(this.build.Context(), this.build.Schema(), errors)
  }
  /** Returns errors for the given value */
  public Errors(value: unknown): [result: boolean, errors: TLocalizedValidationError[]] {
    return Errors(this.build.Context(), this.build.Schema(), value)
  }
}
// ------------------------------------------------------------------
// Compile
// ------------------------------------------------------------------
/** Compiles this schema into a high performance Validator */
export function Compile<const Schema extends Schema.XSchema>(schema: Schema): Validator<Schema>
/** Compiles this schema into a high performance Validator */
export function Compile<const Schema extends Schema.XSchema>(context: Record<PropertyKey, Schema.XSchema>, schema: Schema): Validator<Schema>
/** Compiles this schema into a high performance Validator */
export function Compile(...args: unknown[]): unknown {
  const [context, schema] = Arguments.Match<[Record<PropertyKey, Schema.XSchema>, Schema.XSchema]>(args, {
    2: (context, schema) => [context, schema],
    1: (schema) => [{}, schema]
  })
  return new Validator(context, schema)
}