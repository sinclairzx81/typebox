/*--------------------------------------------------------------------------

TypeBox

The MIT License (MIT)

Copyright (c) 2017-2026 Haydn Paterson

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

import Type, { type TUnionToTuple } from 'typebox'

// -----------------------------------------------------------------------------
// Guards
// -----------------------------------------------------------------------------
type TIsNever<T> = [T] extends [never] ? true : false;
type TIsUnion<T, U = T> = T extends any ? [U] extends [T] ? false : true : never
type TIsLiteralNumber<T> = number extends T ? false : T extends number ? true : false;
type TIsLiteralString<T> = string extends T ? false : T extends string ? true : false;
type TIsLiteralBoolean<T> = boolean extends T ? false : T extends boolean ? true : false;
type TIsLiteralBigInt<T> = bigint extends T ? false : T extends bigint ? true : false;
// -----------------------------------------------------------------------------
// Union
// -----------------------------------------------------------------------------
type TFromUnion<T extends unknown[], Result extends Type.TSchema[] = []> = (
  T extends [infer Left extends unknown, ...infer Right extends unknown[]]
    ? TFromUnion<Right, [...Result, TFromType<Left>]>
    : Type.TUnion<Result>
)
// -----------------------------------------------------------------------------
// Tuple
// -----------------------------------------------------------------------------
type TFromTuple<T extends unknown[], Result extends Type.TSchema[] = []> = (
  T extends [infer Left extends unknown, ...infer Right extends unknown[]]
    ? TFromTuple<Right, [...Result, TFromType<Left>]>
    : Type.TTuple<Result>
)
// -----------------------------------------------------------------------------
// ArrayOrTuple
// -----------------------------------------------------------------------------
type TFromArrayOrTuple<T extends unknown[]> = (
  TIsLiteralNumber<T['length']> extends true // Tuple Is Fixed Length
    ? TFromTuple<T>
    : T extends Array<infer Item> 
      ? Type.TArray<TFromType<Item>> 
      : Type.TArray<Type.TNever>
)
// -----------------------------------------------------------------------------
// Object
// -----------------------------------------------------------------------------
type TFromObject<Props extends Record<string | number, unknown>,
  Properties extends Type.TProperties = { [Key in keyof Props]: TFromType<Props[Key]> },
  Result extends Type.TSchema = Type.TObject<Properties>
> = Result
// -----------------------------------------------------------------------------
// Primitive
// -----------------------------------------------------------------------------
type TIsAny<_T> = 0 extends (1 & _T) ? true : false
type TIsUnknown<T> = TIsAny<T> extends true ? false : unknown extends T ? T extends unknown ? true : false : false
type TFromAny<_ extends any> = Type.TAny
type TFromUnknown<_ extends any> = Type.TUnknown
type TFromBigInt<T extends bigint> = TIsLiteralBigInt<T> extends true ? Type.TLiteral<T> : Type.TBigInt
type TFromNumber<T extends number> = TIsLiteralNumber<T> extends true ? Type.TLiteral<T> : Type.TNumber
type TFromString<T extends string> = TIsLiteralString<T> extends true ? Type.TLiteral<T> : Type.TString
type TFromBoolean<T extends boolean> = TIsLiteralBoolean<T> extends true ? Type.TLiteral<T> : Type.TBoolean
type TFromNull<_ extends null> = Type.TNull
type TFromUndefined<_ extends undefined> = Type.TUndefined
type TFromNever<_> = Type.TNever

// -----------------------------------------------------------------------------
// Type
// -----------------------------------------------------------------------------
type TFromType<Type extends unknown,
  Schema extends Type.TSchema = (
    TIsNever<Type> extends true ? TFromNever<Type> :
    TIsUnknown<Type> extends true ? TFromUnknown<Type> :
    TIsUnion<Type> extends true ? TFromUnion<TUnionToTuple<Type>> :
    Type extends unknown[] ? TFromArrayOrTuple<Type> : 
    Type extends Record<string | number, unknown> ? TFromObject<Type> :
    Type extends bigint ? TFromBigInt<Type> :
    Type extends boolean ? TFromBoolean<Type> :
    Type extends number ? TFromNumber<Type> :
    Type extends string ? TFromString<Type> :
    Type extends undefined ? TFromUndefined<Type> :
    Type extends null ? TFromNull<Type> :
    Type extends never ? TFromNever<Type> :
    Type.TUnknown
  ),
  // We interpret a union Schema as TAny
  Result extends Type.TSchema = (
    TIsUnion<Schema> extends true 
      ? TFromAny<Type> 
      : Schema
  )
> = Result

/** Generates a TypeBox type from TypeScript type */
export type ReverseStatic<Type extends unknown, 
  Result extends Type.TSchema = TFromType<Type>
> = Result
