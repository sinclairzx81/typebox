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

import { Arguments } from '../system/arguments/index.ts'
import { Settings } from '../system/settings/index.ts'
import { Get as LocaleGet } from '../system/locale/_config.ts'
import { Guard } from '../guard/index.ts'

import { type TLocalizedValidationError } from '../error/index.ts'
import * as Schema from './types/index.ts'
import * as Engine from './engine/index.ts'

/** Checks a value and returns validation errors */
export function Errors(schema: Schema.XSchema, value: unknown): [boolean, TLocalizedValidationError[]]
/** Checks a value and returns validation errors */
export function Errors(context: Record<PropertyKey, Schema.XSchema>, schema: Schema.XSchema, value: unknown): [boolean, TLocalizedValidationError[]]
/** Checks a value and returns validation errors */
export function Errors(...args: unknown[]): [boolean, TLocalizedValidationError[]] {
  const [context, schema, value] = Arguments.Match<[Record<PropertyKey, Schema.XSchema>, Schema.XSchema, unknown]>(args, {
    3: (context, schema, value) => [context, schema, value],
    2: (schema, value) => [{}, schema, value]
  })
  const settings = Settings.Get()
  const locale = LocaleGet()
  const errors: TLocalizedValidationError[] = []

  const stack = new Engine.Stack(context, schema)
  const errorContext = new Engine.ErrorContext(error => {
    if(Guard.IsGreaterEqualThan(errors.length, settings.maxErrors)) return
    return errors.push({ ...error, message: locale(error) })
  })
  const result = Engine.ErrorSchema(stack, errorContext, '#', '', schema, value)
  return [result, errors]
}