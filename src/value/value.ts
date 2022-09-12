/*--------------------------------------------------------------------------

@sinclair/typebox/value

The MIT License (MIT)

Copyright (c) 2022 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

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
import { ValueErrors, ValueError } from '../errors/index'
import { ValueEqual } from './equal'
import { ValueCast } from './cast'
import { ValueClone } from './clone'
import { ValueCreate } from './create'
import { ValueCheck } from './check'
import { ValueDelta, Edit } from './delta'

export type { Edit } from './delta'

/** Value performs immutable operations on values */
export namespace Value {
  /** Casts a value into a given type. The return value will retain as much information of the original value as possible. Cast will convert string, number and boolean values if a reasonable conversion is possible. */
  export function Cast<T extends Types.TSchema, R extends Types.TSchema[]>(schema: T, references: [...R], value: unknown): Types.Static<T>
  /** Casts a value into a given type. The return value will retain as much information of the original value as possible. Cast will convert string, number and boolean values if a reasonable conversion is possible. */
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

  /** Returns an iterator for each error in this value. */
  export function Errors<T extends Types.TSchema, R extends Types.TSchema[]>(schema: T, references: [...R], value: unknown): IterableIterator<ValueError>
  /** Returns an iterator for each error in this value. */
  export function Errors<T extends Types.TSchema>(schema: T, value: unknown): IterableIterator<ValueError>
  export function* Errors(...args: any[]) {
    const [schema, references, value] = args.length === 3 ? [args[0], args[1], args[2]] : [args[0], [], args[1]]
    yield* ValueErrors.Errors(schema, references, value)
  }

  /** Returns true if left and right values are structurally equal */
  export function Equal<T>(left: T, right: unknown): right is T {
    return ValueEqual.Equal(left, right)
  }

  /** Returns a structural clone of the given value */
  export function Clone<T>(value: T): T {
    return ValueClone.Clone(value)
  }

  /** Returns edits to transform the current value into the next value */
  export function Diff<T>(current: T, next: T): Edit<T>[] {
    return ValueDelta.Diff(current, next)
  }

  /** Returns a new value with edits applied to the given value */
  export function Patch<T>(current: T, edits: Edit<T>[]): T {
    return ValueDelta.Patch(current, edits) as T
  }
}
