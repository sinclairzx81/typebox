/*--------------------------------------------------------------------------

@sinclair/typebox/collections

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

import { TypeCheck, TypeCompiler, ValueError } from '@sinclair/typebox/compiler'
import { TSchema, Static, TypeBoxError } from '@sinclair/typebox'
import { Value } from '@sinclair/typebox/value'

// ----------------------------------------------------------------
// Errors
// ----------------------------------------------------------------
export class TypeSetError extends TypeBoxError {
  constructor(message: string) {
    super(`${message}`)
  }
}
// ----------------------------------------------------------------
// TypeSet
// ----------------------------------------------------------------
/** Runtime type checked Set collection */
export class TypeSet<T extends TSchema> {
  readonly #valuecheck: TypeCheck<T>
  readonly values: Map<bigint, Static<T>>
  constructor(schema: T, iterable: Array<T> | Iterable<T> = []) {
    this.#valuecheck = TypeCompiler.Compile(schema)
    this.values = new Map<bigint, Static<T>>()
    for (const value of iterable) {
      this.add(value)
    }
  }
  /** Adds a value to this set */
  public add(value: Static<T>): this {
    this.#assertValue(value)
    this.values.set(this.#encodeKey(value), value)
    return this
  }
  /** Clears the values in this set */
  public clear(): void {
    this.values.clear()
  }
  /**
   * Removes a specified value from the Set.
   * @returns Returns true if an element in the Set existed and has been removed, or false if the element does not exist.
   */
  public delete(value: Static<T>): boolean {
    return this.values.delete(this.#encodeKey(value))
  }
  /** Executes a provided function once per each value in the Set object, in insertion order. */
  public forEach(callbackfn: (value: Static<T>, value2: Static<T>, set: TypeSet<T>) => void, thisArg?: any): void {
    this.values.forEach((value, value2) => callbackfn(value, value2, this), thisArg)
  }
  /**
   * @returns a boolean indicating whether an element with the specified value exists in the Set or not.
   */
  public has(value: Static<T>): boolean {
    return this.values.has(this.#encodeKey(value))
  }
  /**
   * @returns the number of (unique) elements in Set.
   */
  public get size(): number {
    return this.values.size
  }
  // ---------------------------------------------------
  // Encoder
  // ---------------------------------------------------
  #encodeKey(value: Static<T>) {
    return Value.Hash(value)
  }
  // ---------------------------------------------------
  // Assertions
  // ---------------------------------------------------
  /** Formats errors */
  #formatError(errors: ValueError[]) {
    return errors
      .map((error) => `${error.message} ${error.path}`)
      .join('. ')
      .trim()
  }
  /** Asserts the key matches the value schema  */
  #assertValue(value: unknown): asserts value is Static<T> {
    if (this.#valuecheck.Check(value)) return
    throw new TypeSetError(this.#formatError([...this.#valuecheck.Errors(value)]))
  }
}
