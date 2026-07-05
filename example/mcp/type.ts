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

import { type TLocalizedValidationError } from 'typebox/error'
import Schema from 'typebox/schema'
import Spec from './spec.ts'

// ------------------------------------------------------------------
// DefinitionName
// ------------------------------------------------------------------
type DefinitionName = Extract<keyof (typeof Spec['$defs']), string>

// ------------------------------------------------------------------
// Validator
// ------------------------------------------------------------------
export class Validator<Type extends unknown = unknown> {
  readonly #validator: Schema.Validator
  constructor(schema: Schema.XSchema) {
    this.#validator = Schema.Compile(schema)
  }
  public Check(value: unknown): value is Type {
    return this.#validator.Check(value)
  }
  public Parse(value: unknown): Type {
    return this.#validator.Parse(value) as Type
  }
  public Errors(value: unknown): TLocalizedValidationError[] {
    return this.#validator.Errors(value)[1]
  }
}
// ------------------------------------------------------------------
// ProtocolType
// ------------------------------------------------------------------
export type ProtocolType<Key extends DefinitionName> = Schema.XStatic<typeof Spec & { $ref: `#/$defs/${Key}` }>

// ------------------------------------------------------------------
// ProtocolValidator
// ------------------------------------------------------------------
export function ProtocolValidator<Name extends DefinitionName> (name: Name): Validator<ProtocolType<Name>> {
  return new Validator({ ...Spec, $ref: `#/$defs/${name}` })
}



