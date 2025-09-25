/*--------------------------------------------------------------------------

TypeBox

The MIT License (MIT)

Copyright (c) 2017-2025 Haydn Paterson

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

import { Memory } from '../../system/index.ts'
import { Guard } from '../../guard/index.ts'
import { type StaticDirection, type StaticType } from './static.ts'
import { IsSchema, type TSchema } from './schema.ts'
import { type TProperties } from './properties.ts'

// ------------------------------------------------------------------
// Static
// ------------------------------------------------------------------
export type StaticCodec<Stack extends string[], Direction extends StaticDirection, Context extends TProperties, This extends TProperties, Type extends TSchema, Decoded extends unknown> = Direction extends 'Decode' ? Decoded
  : StaticType<Stack, Direction, Context, This, Type>

// ------------------------------------------------------------------
// Type
// ------------------------------------------------------------------
export type TDecodeCallback<Type extends TSchema, Decoded = unknown> = (input: StaticType<[], 'Decode', {}, {}, Type>) => Decoded
export type TEncodeCallback<Type extends TSchema, Decoded = unknown> = (input: Decoded) => StaticType<[], 'Decode', {}, {}, Type>
export type TCodec<Type extends TSchema = TSchema, Decoded extends unknown = unknown> = Type & {
  '~codec': {
    encode: TDecodeCallback<Type, Decoded>
    decode: TEncodeCallback<Type, Decoded>
  }
}
// ------------------------------------------------------------------
// Factory
// ------------------------------------------------------------------
export class EncodeBuilder<Type extends TSchema, Decoded extends unknown> {
  constructor(private readonly type: Type, private readonly decode: Function) {}
  public Encode<Callback extends TEncodeCallback<Type, Decoded>>(callback: Callback): TCodec<Type, Decoded> {
    const type = this.type
    const decode = IsCodec(type) ? (value: unknown) => this.decode(type['~codec'].decode(value)) : this.decode
    const encode = IsCodec(type) ? (value: unknown) => type['~codec'].encode(callback(value as never)) : callback
    const codec = { decode, encode }
    return Memory.Update(this.type, { '~codec': codec }, {}) as never
  }
}
export class DecodeBuilder<Type extends TSchema> {
  constructor(private readonly type: Type) {}
  public Decode<Callback extends TDecodeCallback<Type>>(callback: Callback): EncodeBuilder<Type, ReturnType<Callback>> {
    return new EncodeBuilder(this.type, callback)
  }
}
// ------------------------------------------------------------------
// Bidirectional
// ------------------------------------------------------------------
/** Creates a bi-directional Codec. Codec functions are called on Value.Decode and Value.Encode. */
export function Codec<Type extends TSchema>(type: Type): DecodeBuilder<Type> {
  return new DecodeBuilder(type)
}
// ------------------------------------------------------------------
// Unidirectional
// ------------------------------------------------------------------
/** Createsa  uni-directional Codec with Decode only. The Decode function is called on Value.Decode */
export function Decode<Type extends TSchema, Callback extends TDecodeCallback<Type>>(type: Type, callback: Callback): TCodec<Type, ReturnType<Callback>> {
  return Codec(type).Decode(callback).Encode(() => {
    throw Error('Encode not implemented')
  })
}
/** Creates a uni-directional Codec with Encode only. The Encode function is called on Value.Encode */
export function Encode<Type extends TSchema, Callback extends TEncodeCallback<Type, unknown>>(type: Type, callback: Callback): TCodec<Type, unknown> {
  return Codec(type).Decode(() => {
    throw Error('Decode not implemented')
  }).Encode(callback) as never
}
// ------------------------------------------------------------------
// Guard
// ------------------------------------------------------------------
export function IsCodec(value: unknown): value is TCodec {
  return IsSchema(value) &&
    Guard.HasPropertyKey(value, '~codec') &&
    Guard.IsObject(value['~codec']) &&
    Guard.HasPropertyKey(value['~codec'], 'encode') &&
    Guard.HasPropertyKey(value['~codec'], 'decode')
}
