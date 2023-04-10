/*--------------------------------------------------------------------------

@sinclair/typebox/value

The MIT License (MIT)

Copyright (c) 2017-2023 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

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

import * as Types from '../typebox'
import { ValueErrors, ValueErrorIterator, ValueError } from '../errors/index'
import { ValueMutate, Mutable } from './mutate'
import { ValueHash } from './hash'
import { ValueEqual } from './equal'
import { ValueCast } from './cast'
import { ValueClone } from './clone'
import { ValueConvert } from './convert'
import { ValueCreate } from './create'
import { ValueCheck } from './check'
import { ValueDelta, Edit } from './delta'

/** Provides functions to perform structural updates to JavaScript values */
export namespace Value {
  /** Casts a value into a given type. The return value will retain as much information of the original value as possible. Cast will convert string, number, boolean and date values if a reasonable conversion is possible. */
  export function Cast<T extends Types.TSchema, R extends Types.TSchema[]>(schema: T, references: [...R], value: unknown): Types.Static<T>
  /** Casts a value into a given type. The return value will retain as much information of the original value as possible. Cast will convert string, number, boolean and date values if a reasonable conversion is possible. */
  export function Cast<T extends Types.TSchema>(schema: T, value: unknown): Types.Static<T>
  export function Cast(...args: any[]) {
    const [schema, references, value] = args.length === 3 ? [args[0], args[1], args[2]] : [args[0], [], args[1]]
    return ValueCast.Cast(schema, references, value)
  }
  /** Creates a value from the given type */
  export function Create<T extends Types.TSchema, R extends Types.TSchema[]>(schema: T, references: [...R]): Types.Static<T>
  /** Creates a value from the given type */
  export function Create<T extends Types.TSchema>(schema: T): Types.Static<T>
  export function Create(...args: any[]) {
    const [schema, references] = args.length === 2 ? [args[0], args[1]] : [args[0], []]
    return ValueCreate.Create(schema, references)
  }
  /** Returns true if the value matches the given type. */
  export function Check<T extends Types.TSchema, R extends Types.TSchema[]>(schema: T, references: [...R], value: unknown): value is Types.Static<T>
  /** Returns true if the value matches the given type. */
  export function Check<T extends Types.TSchema>(schema: T, value: unknown): value is Types.Static<T>
  export function Check(...args: any[]) {
    const [schema, references, value] = args.length === 3 ? [args[0], args[1], args[2]] : [args[0], [], args[1]]
    return ValueCheck.Check(schema, references, value)
  }
  /** Converts any type mismatched values to their target type if a conversion is possible. */
  export function Convert<T extends Types.TSchema, R extends Types.TSchema[]>(schema: T, references: [...R], value: unknown): unknown
  /** Converts any type mismatched values to their target type if a conversion is possible. */
  export function Convert<T extends Types.TSchema>(schema: T, value: unknown): unknown
  export function Convert(...args: any[]) {
    const [schema, references, value] = args.length === 3 ? [args[0], args[1], args[2]] : [args[0], [], args[1]]
    return ValueConvert.Convert(schema, references, value)
  }
  /** Returns a structural clone of the given value */
  export function Clone<T>(value: T): T {
    return ValueClone.Clone(value)
  }
  /** Returns an iterator for each error in this value. */
  export function Errors<T extends Types.TSchema, R extends Types.TSchema[]>(schema: T, references: [...R], value: unknown): ValueErrorIterator
  /** Returns an iterator for each error in this value. */
  export function Errors<T extends Types.TSchema>(schema: T, value: unknown): ValueErrorIterator
  export function Errors(...args: any[]) {
    const [schema, references, value] = args.length === 3 ? [args[0], args[1], args[2]] : [args[0], [], args[1]]
    return ValueErrors.Errors(schema, references, value) as ValueErrorIterator
  }
  /** Returns true if left and right values are structurally equal */
  export function Equal<T>(left: T, right: unknown): right is T {
    return ValueEqual.Equal(left, right)
  }
  /** Returns edits to transform the current value into the next value */
  export function Diff(current: unknown, next: unknown): Edit[] {
    return ValueDelta.Diff(current, next)
  }
  /** Returns a FNV1A-64 non cryptographic hash of the given value */
  export function Hash(value: unknown): bigint {
    return ValueHash.Create(value)
  }
  /** Returns a new value with edits applied to the given value */
  export function Patch<T = any>(current: unknown, edits: Edit[]): T {
    return ValueDelta.Patch(current, edits) as T
  }
  /** Performs a deep mutable value assignment while retaining internal references. */
  export function Mutate(current: Mutable, next: Mutable): void {
    ValueMutate.Mutate(current, next)
  }
}
