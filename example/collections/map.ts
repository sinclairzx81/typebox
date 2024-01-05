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
// TypeMapKeyError
// ----------------------------------------------------------------
export class TypeMapKeyError extends TypeBoxError {
  constructor(message: string) {
    super(`${message} for key`)
  }
}
export class TypeMapValueError extends TypeBoxError {
  constructor(key: unknown, message: string) {
    super(`${message} for key ${JSON.stringify(key)}`)
  }
}
// ----------------------------------------------------------------
// TypeMap<K, V>
// ----------------------------------------------------------------
// prettier-ignore
type TypeMapEntries<K extends TSchema, V extends TSchema> =
  | Iterable<[Static<K>, Static<V>]> 
  | Array<[Static<K>, Static<V>]>
/** Runtime type checked Map collection */
export class TypeMap<K extends TSchema, V extends TSchema> {
  readonly #keycheck: TypeCheck<K>
  readonly #valuecheck: TypeCheck<V>
  readonly #keys: Map<bigint, Static<K>>
  readonly #values: Map<bigint, Static<V>>
  /** Constructs a new HashMap of the given key and value types. */
  constructor(key: K, value: V, entries: TypeMapEntries<K, V> = []) {
    this.#keycheck = TypeCompiler.Compile(key)
    this.#valuecheck = TypeCompiler.Compile(value)
    this.#keys = new Map<bigint, Static<K>>()
    this.#values = new Map<bigint, Static<V>>()
    for (const [key, value] of entries) {
      this.set(key, value)
    }
  }
  /** Iterator for this TypeMap */
  public *[Symbol.iterator](): IterableIterator<[Static<K>, Static<V>]> {
    for (const [key, value] of this.#values) {
      yield [this.#keys.get(key)!, value]
    }
  }
  /** Iterator for the keys in this TypeMap */
  public *keys(): IterableIterator<Static<K>> {
    yield* this.#keys.values()
  }
  /** Iterator for the values in this TypeMap */
  public *values(): IterableIterator<Static<V>> {
    yield* this.#values.values()
  }
  /** Clears all entries in this map */
  public clear(): void {
    this.#values.clear()
    this.#keys.clear()
  }
  /** Executes a provided function once per each key/value pair in the Map, in insertion order. */
  public forEach(callbackfn: (value: Static<V>, key: Static<K>, map: TypeMap<K, V>) => void, thisArg?: any): void {
    this.#values.forEach((value, key) => callbackfn(value, this.#keys.get(key)!, this))
  }
  /** @returns the number of elements in the TypeMap. */
  public get size(): number {
    return this.#values.size
  }
  /**
   * @returns boolean indicating whether an element with the specified key exists or not.
   */
  public has(key: Static<K>): boolean {
    this.#assertKey(key)
    return this.#values.has(this.#encodeKey(key))
  }
  /**
   * Returns a specified element from the Map object. If the value that is associated to the provided key is an object, then you will get a reference to that object and any change made to that object will effectively modify it inside the Map.
   * @returns Returns the element associated with the specified key. If no element is associated with the specified key, undefined is returned.
   */
  public get(key: Static<K>): Static<V> | undefined {
    this.#assertKey(key)
    return this.#values.get(this.#encodeKey(key))!
  }
  /**
   * Adds a new element with a specified key and value to the Map. If an element with the same key already exists, the element will be updated.
   */
  public set(key: Static<K>, value: Static<V>) {
    this.#assertKey(key)
    this.#assertValue(key, value)
    const encodedKey = this.#encodeKey(key)
    this.#keys.set(encodedKey, key)
    this.#values.set(encodedKey, value)
  }
  /**
   * @returns true if an element in the Map existed and has been removed, or false if the element does not exist.
   */
  public delete(key: Static<K>): boolean {
    this.#assertKey(key)
    const encodedKey = this.#encodeKey(key)
    this.#keys.delete(encodedKey)
    return this.#values.delete(encodedKey)
  }
  // ---------------------------------------------------
  // Encoder
  // ---------------------------------------------------
  /** Encodes the key as a 64bit numeric */
  #encodeKey(key: Static<K>) {
    return Value.Hash(key)
  }
  // ---------------------------------------------------
  // Assertions
  // ---------------------------------------------------
  #formatError(errors: ValueError[]) {
    return errors
      .map((error) => `${error.message} ${error.path}`)
      .join('. ')
      .trim()
  }
  /** Asserts the key matches the key schema  */
  #assertKey(key: unknown): asserts key is Static<K> {
    if (this.#keycheck.Check(key)) return
    throw new TypeMapKeyError(this.#formatError([...this.#keycheck.Errors(key)]))
  }
  /** Asserts the key matches the value schema  */
  #assertValue(key: Static<K>, value: unknown): asserts value is Static<V> {
    if (this.#valuecheck.Check(value)) return
    throw new TypeMapValueError(key, this.#formatError([...this.#valuecheck.Errors(value)]))
  }
}
