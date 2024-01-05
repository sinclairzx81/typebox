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
// TypeArrayError
// ----------------------------------------------------------------
export class TypeArrayError extends TypeBoxError {
  constructor(message: string) {
    super(`${message}`)
  }
}
export class TypeArrayLengthError extends TypeBoxError {
  constructor() {
    super('arrayLength not a number')
  }
}
// ----------------------------------------------------------------
// TypeArray<T>
// ----------------------------------------------------------------
export class TypeArray<T extends TSchema> implements Iterable<Static<T>> {
  readonly #typeCheck: TypeCheck<T>
  readonly #values: Static<T>[]
  constructor(schema: T, arrayLength: number = 0) {
    if (typeof arrayLength !== 'number') throw new TypeArrayLengthError()
    this.#typeCheck = TypeCompiler.Compile(schema)
    this.#values = new Array(arrayLength)
    for (let i = 0; i < arrayLength; i++) {
      this.#values[i] = Value.Create(schema)
    }
  }
  // ---------------------------------------------------
  // Indexer
  // ---------------------------------------------------
  /** Sets the value at the given index */
  public set(index: number, item: Static<T>): void {
    this.#assertIndexInBounds(index)
    this.#assertItem(index, item)
    this.#values[index] = item
  }
  // ---------------------------------------------------
  // Array<T>
  // ---------------------------------------------------
  /** Iterator for values in this array */
  public [Symbol.iterator](): IterableIterator<Static<T>> {
    return this.#values[Symbol.iterator]() as IterableIterator<T>
  }
  /** Gets the value at the given index */
  public at(index: number): Static<T> {
    this.#assertIndexInBounds(index)
    return this.#values[index] as T
  }
  /**
   * Gets the length of the array. This is a number one higher than the highest index in the array.
   */
  public get length(): number {
    return this.#values.length
  }
  /**
   * Returns a string representation of an array.
   */
  public toString(): string {
    return this.#values.toString()
  }
  /**
   * Returns a string representation of an array. The elements are converted to string using their toLocaleString methods.
   */
  public toLocaleString(): string {
    return this.#values.toLocaleString()
  }
  /**
   * Removes the last element from an array and returns it.
   * If the array is empty, undefined is returned and the array is not modified.
   */
  public pop(): Static<T> | undefined {
    return this.#values.pop()
  }
  /**
   * Appends new elements to the end of an array, and returns the new length of the array.
   * @param items New elements to add to the array.
   */
  public push(...items: Static<T>[]): number {
    this.#assertItems(items)
    return this.#values.push(...items)
  }
  /**
   * Combines two or more arrays.
   * This method returns a new array without modifying any existing arrays.
   * @param items Additional arrays and/or items to add to the end of the array.
   */
  public concat(...items: ConcatArray<Static<T>>[]): Static<T>[]
  /**
   * Combines two or more arrays.
   * This method returns a new array without modifying any existing arrays.
   * @param items Additional arrays and/or items to add to the end of the array.
   */
  public concat(...items: (T | ConcatArray<Static<T>>)[]): Static<T>[] {
    this.#assertItems(items)
    return this.#values.concat(...items) as Static<T>[]
  }
  /**
   * Adds all the elements of an array into a string, separated by the specified separator string.
   * @param separator A string used to separate one element of the array from the next in the resulting string. If omitted, the array elements are separated with a comma.
   */
  public join(separator?: string): string {
    return this.#values.join(separator)
  }
  /**
   * Reverses the elements in an array in place.
   * This method mutates the array and returns a reference to the same array.
   */
  public reverse(): Static<T>[] {
    return this.#values.reverse() as Static<T>[]
  }
  /**
   * Removes the first element from an array and returns it.
   * If the array is empty, undefined is returned and the array is not modified.
   */
  public shift(): Static<T> | undefined {
    return this.#values.shift() as Static<T> | undefined
  }
  /**
   * Returns a copy of a section of an array.
   * For both start and end, a negative index can be used to indicate an offset from the end of the array.
   * For example, -2 refers to the second to last element of the array.
   * @param start The beginning index of the specified portion of the array.
   * If start is undefined, then the slice begins at index 0.
   * @param end The end index of the specified portion of the array. This is exclusive of the element at the index 'end'.
   * If end is undefined, then the slice extends to the end of the array.
   */
  public slice(start?: number, end?: number): Static<T>[] {
    return this.#values.slice(start, end) as Static<T>[]
  }
  /**
   * Sorts an array in place.
   * This method mutates the array and returns a reference to the same array.
   * @param compareFn Function used to determine the order of the elements. It is expected to return
   * a negative value if the first argument is less than the second argument, zero if they're equal, and a positive
   * value otherwise. If omitted, the elements are sorted in ascending, ASCII character order.
   * ```ts
   * [11,2,22,1].sort((a, b) => a - b)
   * ```
   */
  public sort(compareFn?: (a: Static<T>, b: Static<T>) => number): this {
    this.#values.sort(compareFn as any)
    return this
  }
  /**
   * Removes elements from an array and, if necessary, inserts new elements in their place, returning the deleted elements.
   * @param start The zero-based location in the array from which to start removing elements.
   * @param deleteCount The number of elements to remove.
   * @returns An array containing the elements that were deleted.
   */
  public splice(start: number, deleteCount?: number): Static<T>[]
  /**
   * Removes elements from an array and, if necessary, inserts new elements in their place, returning the deleted elements.
   * @param start The zero-based location in the array from which to start removing elements.
   * @param deleteCount The number of elements to remove.
   * @param items Elements to insert into the array in place of the deleted elements.
   * @returns An array containing the elements that were deleted.
   */
  public splice(start: number, deleteCount: number, ...items: Static<T>[]): Static<T>[] {
    this.#assertItems(items)
    return this.#values.splice(start, deleteCount, items) as Static<T>[]
  }
  /**
   * Inserts new elements at the start of an array, and returns the new length of the array.
   * @param items Elements to insert at the start of the array.
   */
  public unshift(...items: Static<T>[]): number {
    this.#assertItems(items)
    return this.#values.unshift(items)
  }
  /**
   * Returns the index of the first occurrence of a value in an array, or -1 if it is not present.
   * @param searchElement The value to locate in the array.
   * @param fromIndex The array index at which to begin the search. If fromIndex is omitted, the search starts at index 0.
   */
  public indexOf(searchElement: Static<T>, fromIndex?: number): number {
    return this.#values.indexOf(searchElement, fromIndex)
  }
  /**
   * Returns the index of the last occurrence of a specified value in an array, or -1 if it is not present.
   * @param searchElement The value to locate in the array.
   * @param fromIndex The array index at which to begin searching backward. If fromIndex is omitted, the search starts at the last index in the array.
   */
  public lastIndexOf(searchElement: Static<T>, fromIndex?: number): number {
    return this.#values.lastIndexOf(searchElement, fromIndex)
  }
  /**
   * Determines whether all the members of an array satisfy the specified test.
   * @param predicate A function that accepts up to three arguments. The every method calls
   * the predicate function for each element in the array until the predicate returns a value
   * which is coercible to the Boolean value false, or until the end of the array.
   * @param thisArg An object to which the this keyword can refer in the predicate function.
   * If thisArg is omitted, undefined is used as the this value.
   */
  public every<S extends T>(predicate: (value: Static<T>, index: number, array: Static<T>[]) => value is Static<S>, thisArg?: any): this is Static<S>[]
  /**
   * Determines whether all the members of an array satisfy the specified test.
   * @param predicate A function that accepts up to three arguments. The every method calls
   * the predicate function for each element in the array until the predicate returns a value
   * which is coercible to the Boolean value false, or until the end of the array.
   * @param thisArg An object to which the this keyword can refer in the predicate function.
   * If thisArg is omitted, undefined is used as the this value.
   */
  public every(predicate: (value: Static<T>, index: number, array: Static<T>[]) => unknown, thisArg?: any): boolean {
    return this.#values.every(predicate as any, thisArg)
  }
  /**
   * Determines whether the specified callback function returns true for any element of an array.
   * @param predicate A function that accepts up to three arguments. The some method calls
   * the predicate function for each element in the array until the predicate returns a value
   * which is coercible to the Boolean value true, or until the end of the array.
   * @param thisArg An object to which the this keyword can refer in the predicate function.
   * If thisArg is omitted, undefined is used as the this value.
   */
  public some(predicate: (value: Static<T>, index: number, array: T[]) => unknown, thisArg?: any): boolean {
    return this.#values.some(predicate as any, thisArg)
  }
  /**
   * Performs the specified action for each element in an array.
   * @param callbackfn  A function that accepts up to three arguments. forEach calls the callbackfn function one time for each element in the array.
   * @param thisArg  An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
   */
  public forEach(callbackfn: (value: Static<T>, index: number, array: Static<T>[]) => void, thisArg?: any): void {
    return this.#values.forEach(callbackfn as any, thisArg)
  }
  /**
   * Calls a defined callback function on each element of an array, and returns an array that contains the results.
   * @param callbackfn A function that accepts up to three arguments. The map method calls the callbackfn function one time for each element in the array.
   * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
   */
  public map<U>(callbackfn: (value: Static<T>, index: number, array: Static<T>[]) => U, thisArg?: any): U[] {
    return this.#values.map(callbackfn as any, thisArg)
  }
  /**
   * Returns the elements of an array that meet the condition specified in a callback function.
   * @param predicate A function that accepts up to three arguments. The filter method calls the predicate function one time for each element in the array.
   * @param thisArg An object to which the this keyword can refer in the predicate function. If thisArg is omitted, undefined is used as the this value.
   */
  public filter<S extends T>(predicate: (value: Static<T>, index: number, array: Static<T>[]) => value is Static<S>, thisArg?: any): Static<S>[]
  /**
   * Returns the elements of an array that meet the condition specified in a callback function.
   * @param predicate A function that accepts up to three arguments. The filter method calls the predicate function one time for each element in the array.
   * @param thisArg An object to which the this keyword can refer in the predicate function. If thisArg is omitted, undefined is used as the this value.
   */
  public filter(predicate: (value: T, index: number, array: T[]) => unknown, thisArg?: any): T[]
  public filter(predicate: any, thisArg: any): any {
    return this.#values.filter(predicate as any, thisArg)
  }
  /**
   * Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
   * @param callbackfn A function that accepts up to four arguments. The reduce method calls the callbackfn function one time for each element in the array.
   * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
   */
  public reduce(callbackfn: (previousValue: Static<T>, currentValue: Static<T>, currentIndex: number, array: T[]) => Static<T>): Static<T>
  public reduce(callbackfn: (previousValue: Static<T>, currentValue: Static<T>, currentIndex: number, array: T[]) => Static<T>, initialValue: Static<T>): Static<T>
  /**
   * Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
   * @param callbackfn A function that accepts up to four arguments. The reduce method calls the callbackfn function one time for each element in the array.
   * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
   */
  public reduce<U>(callbackfn: (previousValue: U, currentValue: Static<T>, currentIndex: number, array: Static<T>[]) => U, initialValue: U): U
  public reduce(callbackfn: any, initialValue?: any): any {
    return this.#values.reduce(callbackfn, initialValue)
  }
  /**
   * Calls the specified callback function for all the elements in an array, in descending order. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
   * @param callbackfn A function that accepts up to four arguments. The reduceRight method calls the callbackfn function one time for each element in the array.
   * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
   */
  public reduceRight(callbackfn: (previousValue: Static<T>, currentValue: Static<T>, currentIndex: number, array: Static<T>[]) => Static<T>): Static<T>
  public reduceRight(callbackfn: (previousValue: Static<T>, currentValue: Static<T>, currentIndex: number, array: Static<T>[]) => Static<T>, initialValue: T): Static<T>
  /**
   * Calls the specified callback function for all the elements in an array, in descending order. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
   * @param callbackfn A function that accepts up to four arguments. The reduceRight method calls the callbackfn function one time for each element in the array.
   * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
   */
  public reduceRight<U>(callbackfn: (previousValue: U, currentValue: Static<T>, currentIndex: number, array: Static<T>[]) => U, initialValue: U): U
  public reduceRight(callbackfn: any, initialValue?: any): any {
    return this.#values.reduceRight(callbackfn, initialValue)
  }
  // ---------------------------------------------------
  // Assertions
  // ---------------------------------------------------
  #formatError(errors: ValueError[]) {
    return errors.map((error) => `${error.message} ${error.path}`).join('. ')
  }
  /** Asserts the given values */
  #assertIndexInBounds(index: number) {
    if (index >= 0 && index < this.#values.length) return
    throw new TypeArrayError(`Index ${index} is outside the bounds of this Array.`)
  }
  /** Asserts the given values */
  #assertItem(index: number, item: unknown): asserts item is Static<T> {
    if (this.#typeCheck.Check(item)) return
    const message = this.#formatError([...this.#typeCheck.Errors(item)])
    throw new TypeArrayError(`Item at Index ${index} is invalid. ${message}`)
  }
  /** Asserts the given values */
  #assertItems(items: unknown[]): asserts items is Static<T>[] {
    for (let i = 0; i < items.length; i++) {
      this.#assertItem(i, items[i])
    }
  }
  /** Creates a typed array from an existing array */
  public static from<T extends TSchema>(schema: T, iterable: IterableIterator<Static<T>> | Array<Static<T>>): TypeArray<T> {
    if (globalThis.Array.isArray(iterable)) {
      const array = new TypeArray(schema, iterable.length)
      for (let i = 0; i < iterable.length; i++) {
        array.set(i, iterable[i])
      }
      return array
    }
    const array = new TypeArray(schema)
    for (const value of iterable) {
      array.push(value)
    }
    return array
  }
}
