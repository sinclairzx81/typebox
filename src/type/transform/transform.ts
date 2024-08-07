/*--------------------------------------------------------------------------

@sinclair/typebox/type

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

import type { TSchema } from '../schema/index'
import type { Static, StaticDecode } from '../static/index'
import { TransformKind } from '../symbols/index'

// ------------------------------------------------------------------
// TypeGuard
// ------------------------------------------------------------------
import { IsTransform } from '../guard/kind'

// ------------------------------------------------------------------
// TransformBuilders
// ------------------------------------------------------------------
export class TransformDecodeBuilder<T extends TSchema> {
  constructor(private readonly schema: T) {}
  public Decode<U extends unknown, D extends TransformFunction<StaticDecode<T>, U>>(decode: D): TransformEncodeBuilder<T, D> {
    return new TransformEncodeBuilder(this.schema, decode)
  }
}
// prettier-ignore
export class TransformEncodeBuilder<T extends TSchema, D extends TransformFunction> {
  constructor(private readonly schema: T, private readonly decode: D) { }
  private EncodeTransform<E extends TransformFunction<ReturnType<D>, StaticDecode<T>>>(encode: E, schema: TTransform) {
    const Encode = (value: unknown) => schema[TransformKind as any].Encode(encode(value as any))
    const Decode = (value: unknown) => this.decode(schema[TransformKind as any].Decode(value))
    const Codec = { Encode: Encode, Decode: Decode }
    return { ...schema, [TransformKind]: Codec }
  }
  private EncodeSchema<E extends TransformFunction<ReturnType<D>, StaticDecode<T>>>(encode: E, schema: TSchema) {
    const Codec = { Decode: this.decode, Encode: encode }
    return { ...schema, [TransformKind]: Codec }
  }
  public Encode<E extends TransformFunction<ReturnType<D>, StaticDecode<T>>>(encode: E): TTransform<T, ReturnType<D>> { 
    return (
      IsTransform(this.schema) ? this.EncodeTransform(encode, this.schema): this.EncodeSchema(encode, this.schema)
    ) as never
  }
}
// ------------------------------------------------------------------
// TransformStatic
// ------------------------------------------------------------------
type TransformStatic<T extends TSchema, P extends unknown[] = []> = T extends TTransform<infer _, infer S> ? S : Static<T, P>
// ------------------------------------------------------------------
// TTransform
// ------------------------------------------------------------------
export type TransformFunction<T = any, U = any> = (value: T) => U
export interface TransformOptions<I extends TSchema = TSchema, O extends unknown = unknown> {
  Decode: TransformFunction<StaticDecode<I>, O>
  Encode: TransformFunction<O, StaticDecode<I>>
}
export interface TTransform<I extends TSchema = TSchema, O extends unknown = unknown> extends TSchema {
  static: TransformStatic<I, this['params']>
  [TransformKind]: TransformOptions<I, O>
  [key: string]: any
}
/** `[Json]` Creates a Transform type */
export function Transform<I extends TSchema>(schema: I): TransformDecodeBuilder<I> {
  return new TransformDecodeBuilder(schema)
}
