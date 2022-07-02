/*--------------------------------------------------------------------------

@sinclair/typebox/guards

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

import {
  Kind,
  TAny,
  TAnySchema,
  TArray,
  TBoolean,
  TConstructor,
  TFunction,
  TInteger,
  TLiteral,
  TNull,
  TNumber,
  TObject,
  TPromise,
  TRecord,
  TRef,
  TSchema,
  TSelf,
  TString,
  TTuple,
  TUint8Array,
  TUndefined,
  TUnion,
  TUnknown,
  TVoid,
} from '../typebox'

type TypeGuard<T extends TSchema> = (value: object) => value is T

function typeGuardFactory<T extends TAnySchema>(kind: T[typeof Kind]): TypeGuard<T> {
  return (value): value is T => (value as any).Kind === kind
}

export namespace TypeGuard {
  export function isTSchema(value: object): value is TSchema {
    return Kind in value
  }

  export const isTAny = typeGuardFactory<TAny>('Any')
  export const isTArray = typeGuardFactory<TArray>('Array')
  export const isTBoolean = typeGuardFactory<TBoolean>('Boolean')
  export const isTConstructor = typeGuardFactory<TConstructor>('Constructor')
  export const isTFunction = typeGuardFactory<TFunction>('Function')
  export const isTInteger = typeGuardFactory<TInteger>('Integer')
  export const isTLiteral = typeGuardFactory<TLiteral>('Literal')
  export const isTNull = typeGuardFactory<TNull>('Null')
  export const isTNumber = typeGuardFactory<TNumber>('Number')
  export const isTObject = typeGuardFactory<TObject>('Object')
  export const isTPromise = typeGuardFactory<TPromise>('Promise')
  export const isTRecord = typeGuardFactory<TRecord>('Record')
  export const isTSelf = typeGuardFactory<TSelf>('Self')
  export const isTRef = typeGuardFactory<TRef>('Ref')
  export const isTString = typeGuardFactory<TString>('String')
  export const isTTuple = typeGuardFactory<TTuple>('Tuple')
  export const isTUndefined = typeGuardFactory<TUndefined>('Undefined')
  export const isTUnion = typeGuardFactory<TUnion>('Union')
  export const isTUint8Array = typeGuardFactory<TUint8Array>('Uint8Array')
  export const isTUnknown = typeGuardFactory<TUnknown>('Unknown')
  export const isTVoid = typeGuardFactory<TVoid>('Void')
}
