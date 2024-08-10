/*--------------------------------------------------------------------------

@sinclair/typebox/value

The MIT License (MIT)

Copyright (c) 2017-2024 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

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

import { Errors, ValueErrorIterator, ValueError } from '../../errors/index'
import { TypeBoxError } from '../../type/error/error'
import { TSchema } from '../../type/schema/index'
import { Static } from '../../type/static/index'
import { Check } from '../check/check'

// ------------------------------------------------------------------
// AssertError
// ------------------------------------------------------------------
export class AssertError extends TypeBoxError {
  readonly #iterator: ValueErrorIterator
  error: ValueError | undefined
  constructor(iterator: ValueErrorIterator) {
    const error = iterator.First()
    super(error === undefined ? 'Invalid Value' : error.message)
    this.#iterator = iterator
    this.error = error
  }
  /** Returns an iterator for each error in this value. */
  public Errors(): ValueErrorIterator {
    return new ValueErrorIterator(this.#Iterator())
  }
  *#Iterator(): IterableIterator<ValueError> {
    if (this.error) yield this.error
    yield* this.#iterator
  }
}
// ------------------------------------------------------------------
// AssertValue
// ------------------------------------------------------------------
function AssertValue(schema: TSchema, references: TSchema[], value: unknown): unknown {
  if (Check(schema, references, value)) return
  throw new AssertError(Errors(schema, references, value))
}
// ------------------------------------------------------------------
// Assert
// ------------------------------------------------------------------
/** Asserts a value matches the given type or throws an `AssertError` if invalid */
export function Assert<T extends TSchema>(schema: T, references: TSchema[], value: unknown): asserts value is Static<T>
/** Asserts a value matches the given type or throws an `AssertError` if invalid */
export function Assert<T extends TSchema>(schema: T, value: unknown): asserts value is Static<T>
/** Asserts a value matches the given type or throws an `AssertError` if invalid */
export function Assert(...args: any[]): unknown {
  return args.length === 3 ? AssertValue(args[0], args[1], args[2]) : AssertValue(args[0], [], args[1])
}
