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

import * as ValueErrors from '../errors/index'
import * as ValueMutate from './transmute'
import * as ValueHash from './hash'
import * as ValueEqual from './equal'
import * as ValueCast from './cast'
import * as ValueClone from './clone'
import * as ValueConvert from './convert'
import * as ValueCreate from './create'
import * as ValueCheck from './check'
import * as ValueDefault from './default'
import * as ValueDelta from './delta'
import * as ValueStrict from './clean'
import * as ValueTransform from './transform'
import * as Types from '../typebox'

/** Functions to perform structural operations on JavaScript values */
export namespace Value {
  /** Casts a value into a given type. The return value will retain as much information of the original value as possible. */
  export function Cast<T extends Types.TSchema>(schema: T, references: Types.TSchema[], value: unknown): Types.Static<T>
  /** Casts a value into a given type. The return value will retain as much information of the original value as possible. */
  export function Cast<T extends Types.TSchema>(schema: T, value: unknown): Types.Static<T>
  /** Casts a value into a given type. The return value will retain as much information of the original value as possible. */
  export function Cast(...args: any[]) {
    return ValueCast.Cast.apply(ValueCast, args as any)
  }
  /** Returns true if the value matches the given type */
  export function Check<T extends Types.TSchema>(schema: T, references: Types.TSchema[], value: unknown): value is Types.Static<T>
  /** Returns true if the value matches the given type */
  export function Check<T extends Types.TSchema>(schema: T, value: unknown): value is Types.Static<T>
  /** Returns true if the value matches the given type */
  export function Check(...args: any[]) {
    return ValueCheck.Check.apply(ValueCheck, args as any)
  }
  /** Returns a structural clone of the given value */
  export function Clone<T>(value: T): T {
    return ValueClone.Clone(value)
  }
  /** `[Mutable]` Removes excess properties from the input value and returns the result. This function is mutable and will modify the input value. To avoid mutation, clone the input value before passing to this function. In addition, this function does not type check the input value and will return invalid results for invalid inputs. You should type check the result before use. */
  export function Clean<T extends Types.TSchema>(schema: T, references: Types.TSchema[], value: unknown): unknown
  /** `[Mutable]` Removes excess properties from the input value and returns the result. This function is mutable and will modify the input value. To avoid mutation, clone the input value before passing to this function. In addition, this function does not type check the input value and will return invalid results for invalid inputs. You should type check the result before use. */
  export function Clean<T extends Types.TSchema>(schema: T, value: unknown): unknown
  /** `[Mutable]` Removes excess properties from the input value and returns the result. This function is mutable and will modify the input value. To avoid mutation, clone the input value before passing to this function. In addition, this function does not type check the input value and will return invalid results for invalid inputs. You should type check the result before use. */
  export function Clean(...args: any[]) {
    return ValueStrict.Clean.apply(ValueStrict, args as any)
  }
  /** Converts any type mismatched values to their target type if a reasonable conversion is possible. This function returns unknown, so it is essential to check the return value before use. */
  export function Convert<T extends Types.TSchema>(schema: T, references: Types.TSchema[], value: unknown): unknown
  /** Converts any type mismatched values to their target type if a reasonable conversion is possible. This function returns unknown, so it is essential to check the return value before use. */
  export function Convert<T extends Types.TSchema>(schema: T, value: unknown): unknown
  /** Converts any type mismatched values to their target type if a reasonable conversion is possible This function returns unknown, so it is essential to check the return value before use. */
  export function Convert(...args: any[]) {
    return ValueConvert.Convert.apply(ValueConvert, args as any)
  }
  /** Creates a value from the given type and references */
  export function Create<T extends Types.TSchema>(schema: T, references: Types.TSchema[]): Types.Static<T>
  /** Creates a value from the given type */
  export function Create<T extends Types.TSchema>(schema: T): Types.Static<T>
  /** Creates a value from the given type */
  export function Create(...args: any[]) {
    return ValueCreate.Create.apply(ValueCreate, args as any)
  }
  /** `[Mutable]` Patches a given value with defaults derived from default schema annotations. This function is mutable and will modify the input value. To avoid mutation, clone the input value prior to calling this function. This function may return an incomplete or invalid result and should be checked before use. */
  export function Default<T extends Types.TSchema>(schema: T, references: Types.TSchema[], value: unknown): unknown
  /** `[Mutable]` Patches a given value with defaults derived from default schema annotations. This function is mutable and will modify the input value. To avoid mutation, clone the input value prior to calling this function. This function may return an incomplete or invalid result and should be checked before use. */
  export function Default<T extends Types.TSchema>(schema: T, value: unknown): unknown
  /** `[Mutable]` Patches a given value with defaults derived from default schema annotations. This function is mutable and will modify the input value. To avoid mutation, clone the input value prior to calling this function. This function may return an incomplete or invalid result and should be checked before use. */
  export function Default(...args: any[]) {
    return ValueDefault.Default.apply(ValueDefault, args as any)
  }
  /** Decodes a value or throws if error */
  export function Decode<T extends Types.TSchema, D = Types.StaticDecode<T>>(schema: T, references: Types.TSchema[], value: unknown): D
  /** Decodes a value or throws if error */
  export function Decode<T extends Types.TSchema, D = Types.StaticDecode<T>>(schema: T, value: unknown): D
  /** Decodes a value or throws if error */
  export function Decode(...args: any[]) {
    const [schema, references, value] = args.length === 3 ? [args[0], args[1], args[2]] : [args[0], [], args[1]]
    if (!Check(schema, references, value)) throw new ValueTransform.TransformDecodeCheckError(schema, value, Errors(schema, references, value).First()!)
    return ValueTransform.DecodeTransform.Decode(schema, references, value, ValueCheck.Check)
  }
  /** Encodes a value or throws if error */
  export function Encode<T extends Types.TSchema, E = Types.StaticEncode<T>>(schema: T, references: Types.TSchema[], value: unknown): E
  /** Encodes a value or throws if error */
  export function Encode<T extends Types.TSchema, E = Types.StaticEncode<T>>(schema: T, value: unknown): E
  /** Encodes a value or throws if error */
  export function Encode(...args: any[]) {
    const [schema, references, value] = args.length === 3 ? [args[0], args[1], args[2]] : [args[0], [], args[1]]
    const encoded = ValueTransform.EncodeTransform.Encode(schema, references, value, ValueCheck.Check)
    if (!Check(schema, references, encoded)) throw new ValueTransform.TransformEncodeCheckError(schema, value, Errors(schema, references, value).First()!)
    return encoded
  }
  /** Returns an iterator for each error in this value. */
  export function Errors<T extends Types.TSchema>(schema: T, references: Types.TSchema[], value: unknown): ValueErrors.ValueErrorIterator
  /** Returns an iterator for each error in this value. */
  export function Errors<T extends Types.TSchema>(schema: T, value: unknown): ValueErrors.ValueErrorIterator
  /** Returns an iterator for each error in this value. */
  export function Errors(...args: any[]) {
    return ValueErrors.Errors.apply(ValueErrors, args as any)
  }
  /** Returns true if left and right values are deeply equal */
  export function Equal<T>(left: T, right: unknown): right is T {
    return ValueEqual.Equal(left, right)
  }
  /** Returns edits to transform the current value into the next value */
  export function Diff(current: unknown, next: unknown): ValueDelta.Edit[] {
    return ValueDelta.Diff(current, next)
  }
  /** Returns a FNV1A-64 non cryptographic hash of the given value */
  export function Hash(value: unknown): bigint {
    return ValueHash.Hash(value)
  }
  /** Returns a new value with edits applied to the given value */
  export function Patch<T = any>(current: unknown, edits: ValueDelta.Edit[]): T {
    return ValueDelta.Patch(current, edits) as T
  }
  /** `[Mutable]` Transforms the current value into the next value and returns the result. This function performs mutable operations on the current value. To avoid mutation, clone the current value before passing to this function. */
  export function Transmute<Next extends ValueMutate.Transmutable>(current: ValueMutate.Transmutable, next: Next): Next {
    return ValueMutate.Transmute(current, next)
  }
}
