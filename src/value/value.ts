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
import { ValueErrors, ValueError } from './errors'
import { ValueCast } from './cast'
import { ValueCreate } from './create'
import { ValueCheck } from './check'

/** Values from TypeBox Types */
export namespace Value {
  /** Creates a value from the given schema and associated referenced schemas */
  export function Create<T extends Types.TSchema, R extends Types.TSchema[]>(schema: T, references: [...R]): Types.Static<T>
  /** Creates a value from the given schema */
  export function Create<T extends Types.TSchema>(schema: T): Types.Static<T>
  /** Creates a value from the given schema */
  export function Create(...args: any[]) {
    const [schema, references] = args.length === 2 ? [args[0], args[1]] : [args[0], []]
    return ValueCreate.Create(schema, references)
  }

  /** Checks if the given value matches the given schema with associated references */
  export function Check<T extends Types.TSchema, R extends Types.TSchema[]>(schema: T, references: [...R], value: any): value is Types.Static<T>
  /** Checks if the given value matches the given schema */
  export function Check<T extends Types.TSchema>(schema: T, value: any): value is Types.Static<T>
  /** Checks if the given value matches the given schema */
  export function Check(...args: any[]) {
    const [schema, references, value] = args.length === 3 ? [args[0], args[1], args[2]] : [args[0], [], args[1]]
    return ValueCheck.Check(schema, references, value)
  }

  /** Casts the given value to match the given schema and associated references. The result will be a value that retains as much information from the original value as possible. */
  export function Cast<T extends Types.TSchema, R extends Types.TSchema[]>(schema: T, references: [...R], value: any): Types.Static<T>
  /** Casts the given value to match the given schema. The result will be a value that retains as much information from the original value as possible. */
  export function Cast<T extends Types.TSchema>(schema: T, value: any): Types.Static<T>
  /** Casts the given value to match the given schema. The result will be a value that retains as much information from the original value as possible. */
  export function Cast(...args: any[]) {
    const [schema, references, value] = args.length === 3 ? [args[0], args[1], args[2]] : [args[0], [], args[1]]
    return ValueCast.Cast(schema, references, value)
  }

  /** Casts the given value to match the given schema and associated references. The result will be a value that retains as much information from the original value as possible. */
  export function Errors<T extends Types.TSchema, R extends Types.TSchema[]>(schema: T, references: [...R], value: any): Generator<ValueError>
  /** Casts the given value to match the given schema. The result will be a value that retains as much information from the original value as possible. */
  export function Errors<T extends Types.TSchema>(schema: T, value: any): Generator<ValueError>
  /** Casts the given value to match the given schema. The result will be a value that retains as much information from the original value as possible. */
  export function* Errors(...args: any[]): Generator<ValueError> {
    const [schema, references, value] = args.length === 3 ? [args[0], args[1], args[2]] : [args[0], [], args[1]]
    yield * ValueErrors.Errors(schema, references, value)
  }
}
