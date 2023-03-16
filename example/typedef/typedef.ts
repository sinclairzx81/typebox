/*--------------------------------------------------------------------------

@sinclair/typeboxdef

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

import { Type, Static, TUnsafe } from '@sinclair/typebox'

// ------------------------------------------------------------------------
// TypeDef Namespace
//
// https://jsontypedef.com/docs/jtd-in-5-minutes/
// ------------------------------------------------------------------------

export type StaticTypeDefUnion<D extends string, M extends Record<string, TUnsafe<any>>> = { [K in keyof M]: { [P in D]: K } & Static<M[K]> }[keyof M]

export namespace TypeDef {
  export function Array<T extends TUnsafe<any>>(element: T) {
    return Type.Unsafe<Array<Static<T>>>({ elements: element })
  }
  export function Boolean() {
    return Type.Unsafe<boolean>({ type: 'boolean' })
  }
  export function Enum<T extends string[]>(values: [...T]) {
    return Type.Unsafe<T[number]>({ enum: values })
  }
  export function Float32() {
    return Type.Unsafe<number>({ type: 'float32' })
  }
  export function Float64() {
    return Type.Unsafe<number>({ type: 'float64' })
  }
  export function Int8() {
    return Type.Unsafe<number>({ type: 'int8' })
  }
  export function Int16() {
    return Type.Unsafe<number>({ type: 'int16' })
  }
  export function Int32() {
    return Type.Unsafe<number>({ type: 'int32' })
  }
  export function Uint8() {
    return Type.Unsafe<number>({ type: 'uint8' })
  }
  export function Uint16() {
    return Type.Unsafe<number>({ type: 'uint16' })
  }
  export function Uint32() {
    return Type.Unsafe<number>({ type: 'uint32' })
  }
  export function Object<T extends Record<string, TUnsafe<any>>>(properties: T) {
    return Type.Unsafe<{ [K in keyof T]: Static<T[K]> }>({ properties })
  }
  export function Record<V extends TUnsafe<any>>(values: V) {
    return Type.Unsafe<Record<string, Static<V>>>({ values })
  }
  export function String() {
    return Type.Unsafe<string>({ type: 'string' })
  }
  export function TimeStamp() {
    return Type.Unsafe<string>({ type: 'timestamp' })
  }
  export function Union<D extends string, M extends Record<string, TUnsafe<any>>>(discriminator: D, mapping: M) {
    return Type.Unsafe<StaticTypeDefUnion<D, M>>({ discriminator, mapping })
  }
}
