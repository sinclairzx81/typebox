/*--------------------------------------------------------------------------

@sinclair/typebox/standard-schema

The MIT License (MIT)

Copyright (c) 2024 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

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

import { AssertError, Value, ValueError, ValueErrorType } from '@sinclair/typebox/value'
import { TSchema, StaticDecode, CloneType } from '@sinclair/typebox'

// ------------------------------------------------------------------
// StandardSchema
// ------------------------------------------------------------------
interface StandardResult<Output> {
  value: Output
  issues: ValueError[]
}
interface StandardSchema<Input = unknown, Output = Input> {
  readonly "~standard": StandardSchemaProperties<Input, Output>
}
interface StandardSchemaProperties<Input = unknown, Output = Input> {
  readonly version: 1
  readonly vendor: 'TypeBox'
  readonly validate: (value: unknown) => StandardResult<Output>
  readonly types?: undefined
}
// ------------------------------------------------------------------
// Issues
// ------------------------------------------------------------------
// prettier-ignore
function CreateIssues(schema: TSchema, value: unknown, error: unknown): ValueError[] {
  const isAssertError = error instanceof AssertError ? error : undefined
  return !isAssertError 
    ? [{errors: [], message: 'Unknown error', path: '/', type: ValueErrorType.Kind, schema, value }]
    : [...isAssertError.Errors()] 
}
// ------------------------------------------------------------------
// Validate
// ------------------------------------------------------------------
// prettier-ignore
function CreateValidator<Type extends TSchema>(schema: Type, references: TSchema[]): (value: unknown) => StandardResult<StaticDecode<Type>> {
  return (value: unknown): StandardResult<StaticDecode<Type>> => {
    try {
      return { value: Value.Parse(schema, references, value), issues: [] }
    } catch (error) {
      return { value: undefined, issues: CreateIssues(schema, value, error) }
    }
  }
}
// ------------------------------------------------------------------
// StandardSchema
// ------------------------------------------------------------------
/** Augments a TypeBox type with the `~standard` validation interface. */
export type TStandardSchema<Input = unknown, Output = Input> = (
  Input & StandardSchema<Input, Output>
)
/** Augments a TypeBox type with the `~standard` validation interface. */
export function StandardSchema<Type extends TSchema>(schema: Type, references: TSchema[] = []): TStandardSchema<Type, StaticDecode<Type>> {
  const standard = { version: 1, vendor: 'TypeBox', validate: CreateValidator(schema, references) }
  return Object.defineProperty(CloneType(schema), "~standard", { 
    enumerable: false, 
    value: standard 
  }) as never
}