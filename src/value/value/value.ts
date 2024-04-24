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

import { TransformDecode, TransformEncode, TransformDecodeCheckError, TransformEncodeCheckError } from '../transform/index'
import { Mutate as MutateValue, type Mutable } from '../mutate/index'
import { Hash as HashValue } from '../hash/index'
import { Equal as EqualValue } from '../equal/index'
import { Cast as CastValue } from '../cast/index'
import { Clone as CloneValue } from '../clone/index'
import { Convert as ConvertValue } from '../convert/index'
import { Create as CreateValue } from '../create/index'
import { Clean as CleanValue } from '../clean/index'
import { Check as CheckValue } from '../check/index'
import { Default as DefaultValue } from '../default/index'
import { Diff as DiffValue, Patch as PatchValue, Edit } from '../delta/index'
import { Errors as ValueErrors, ValueErrorIterator } from '../../errors/index'

import type { TSchema } from '../../type/schema/index'
import type { Static, StaticDecode, StaticEncode } from '../../type/static/index'

/** Casts a value into a given type. The return value will retain as much information of the original value as possible. */
export function Cast<T extends TSchema>(schema: T, references: TSchema[], value: unknown): Static<T>
/** Casts a value into a given type. The return value will retain as much information of the original value as possible. */
export function Cast<T extends TSchema>(schema: T, value: unknown): Static<T>
/** Casts a value into a given type. The return value will retain as much information of the original value as possible. */
export function Cast(...args: any[]) {
  return CastValue.apply(CastValue, args as any)
}
/** Creates a value from the given type and references */
export function Create<T extends TSchema>(schema: T, references: TSchema[]): Static<T>
/** Creates a value from the given type */
export function Create<T extends TSchema>(schema: T): Static<T>
/** Creates a value from the given type */
export function Create(...args: any[]) {
  return CreateValue.apply(CreateValue, args as any)
}
/** Returns true if the value matches the given type and references */
export function Check<T extends TSchema>(schema: T, references: TSchema[], value: unknown): value is Static<T>
/** Returns true if the value matches the given type */
export function Check<T extends TSchema>(schema: T, value: unknown): value is Static<T>
/** Returns true if the value matches the given type */
export function Check(...args: any[]) {
  return CheckValue.apply(CheckValue, args as any)
}
/** `[Mutable]` Removes excess properties from a value and returns the result. This function does not check the value and returns an unknown type. You should Check the result before use. Clean is a mutable operation. To avoid mutation, Clone the value first. */
export function Clean(schema: TSchema, references: TSchema[], value: unknown): unknown
/** `[Mutable]` Removes excess properties from a value and returns the result. This function does not check the value and returns an unknown type. You should Check the result before use. Clean is a mutable operation. To avoid mutation, Clone the value first. */
export function Clean(schema: TSchema, value: unknown): unknown
/** `[Mutable]` Removes excess properties from a value and returns the result. This function does not check the value and returns an unknown type. You should Check the result before use. Clean is a mutable operation. To avoid mutation, Clone the value first. */
export function Clean(...args: any[]) {
  return CleanValue.apply(CleanValue, args as any)
}
/** Converts any type mismatched values to their target type if a reasonable conversion is possible. */
export function Convert(schema: TSchema, references: TSchema[], value: unknown): unknown
/** Converts any type mismatched values to their target type if a reasonable conversion is possible. */
export function Convert(schema: TSchema, value: unknown): unknown
/** Converts any type mismatched values to their target type if a reasonable conversion is possible. */
export function Convert(...args: any[]) {
  return ConvertValue.apply(ConvertValue, args as any)
}
/** Returns a structural clone of the given value */
export function Clone<T>(value: T): T {
  return CloneValue(value)
}
/** Decodes a value or throws if error */
export function Decode<T extends TSchema, R = StaticDecode<T>>(schema: T, references: TSchema[], value: unknown): R
/** Decodes a value or throws if error */
export function Decode<T extends TSchema, R = StaticDecode<T>>(schema: T, value: unknown): R
/** Decodes a value or throws if error */
export function Decode(...args: any[]) {
  const [schema, references, value] = args.length === 3 ? [args[0], args[1], args[2]] : [args[0], [], args[1]]
  if (!Check(schema, references, value)) throw new TransformDecodeCheckError(schema, value, Errors(schema, references, value).First()!)
  return TransformDecode(schema, references, value)
}
/** `[Mutable]` Generates missing properties on a value using default schema annotations if available. This function does not check the value and returns an unknown type. You should Check the result before use. Default is a mutable operation. To avoid mutation, Clone the value first. */
export function Default(schema: TSchema, references: TSchema[], value: unknown): unknown
/** `[Mutable]` Generates missing properties on a value using default schema annotations if available. This function does not check the value and returns an unknown type. You should Check the result before use. Default is a mutable operation. To avoid mutation, Clone the value first. */
export function Default(schema: TSchema, value: unknown): unknown
/** `[Mutable]` Generates missing properties on a value using default schema annotations if available. This function does not check the value and returns an unknown type. You should Check the result before use. Default is a mutable operation. To avoid mutation, Clone the value first. */
export function Default(...args: any[]) {
  return DefaultValue.apply(DefaultValue, args as any)
}
/** Encodes a value or throws if error */
export function Encode<T extends TSchema, R = StaticEncode<T>>(schema: T, references: TSchema[], value: unknown): R
/** Encodes a value or throws if error */
export function Encode<T extends TSchema, R = StaticEncode<T>>(schema: T, value: unknown): R
/** Encodes a value or throws if error */
export function Encode(...args: any[]) {
  const [schema, references, value] = args.length === 3 ? [args[0], args[1], args[2]] : [args[0], [], args[1]]
  const encoded = TransformEncode(schema, references, value)
  if (!Check(schema, references, encoded)) throw new TransformEncodeCheckError(schema, encoded, Errors(schema, references, encoded).First()!)
  return encoded
}
/** Returns an iterator for each error in this value. */
export function Errors<T extends TSchema>(schema: T, references: TSchema[], value: unknown): ValueErrorIterator
/** Returns an iterator for each error in this value. */
export function Errors<T extends TSchema>(schema: T, value: unknown): ValueErrorIterator
/** Returns an iterator for each error in this value. */
export function Errors(...args: any[]) {
  return ValueErrors.apply(ValueErrors, args as any)
}
/** Returns true if left and right values are structurally equal */
export function Equal<T>(left: T, right: unknown): right is T {
  return EqualValue(left, right)
}
/** Returns edits to transform the current value into the next value */
export function Diff(current: unknown, next: unknown): Edit[] {
  return DiffValue(current, next)
}
/** Returns a FNV1A-64 non cryptographic hash of the given value */
export function Hash(value: unknown): bigint {
  return HashValue(value)
}
/** Returns a new value with edits applied to the given value */
export function Patch<T = any>(current: unknown, edits: Edit[]): T {
  return PatchValue(current, edits) as T
}
/** `[Mutable]` Performs a deep mutable value assignment while retaining internal references. */
export function Mutate(current: Mutable, next: Mutable): void {
  MutateValue(current, next)
}
