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

import { AssertError, Value, ValueError } from '@sinclair/typebox/value'
import { TSchema, StaticDecode, CloneType } from '@sinclair/typebox'

// ------------------------------------------------------------------
// StandardSchema: Common
// ------------------------------------------------------------------
interface StandardResult<Output> {
  value: Output
  issues: [ValueError[]]
}
interface StandardSchema<Input = unknown, Output = Input> {
  readonly "~standard": StandardSchemaProps<Input, Output>;
}

interface StandardSchemaProps<Input = unknown, Output = Input> {
  readonly version: 1;
  readonly vendor: 'TypeBox';
  readonly validate: (value: unknown) => StandardResult<Output>;
  readonly types?: undefined;
}
// ------------------------------------------------------------------
// StandardSchema: TypeBox
// ------------------------------------------------------------------
export type TStandardSchema<Input = unknown, Output = Input, Result = Input & StandardSchema<Input, Output>> = Result
/** 
 * Augments a Json Schema with runtime validation logic required by StandardSchema. Wrapping a type in this way renders the type
 * incompatible with the Json Schema specification.
 */
export function StandardSchema<Type extends TSchema>(schema: Type, references: TSchema[] = []): TStandardSchema<Type, StaticDecode<Type>> {
  const validate = (value: unknown) => {
    try {
      return { value: Value.Parse(schema, references, value) }
    } catch (error) {
      const asserted = error instanceof AssertError ? error : undefined
      return asserted ? { issues: [...asserted.Errors()] } : { issues: ['Unknown error']}
    }
  }
  const standard = { version: 1, vendor: 'TypeBox', validate }
  return CloneType(schema, { ['~standard']: standard }) as never
}