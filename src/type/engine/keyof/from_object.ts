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

// deno-fmt-ignore-file

import { type TUnreachable, Unreachable } from '../../../system/unreachable/index.ts'

import { Guard } from '../../../guard/index.ts'
import { type TSchema } from '../../types/index.ts'
import { type TUnionToTuple } from '../helpers/index.ts'
import { type TProperties } from '../../types/properties.ts'
import { type TLiteral, type TLiteralValue, Literal, IsLiteralValue } from '../../types/literal.ts'
import { ConvertToIntegerKey } from '../helpers/keys.ts'

import { type TEvaluateUnionFast, EvaluateUnionFast } from '../evaluate/evaluate.ts'

// ------------------------------------------------------------------
// Keys
//
// deno-coverage-ignore-start - symmetric unreachable | internal
//
// There isn't a scenario where this function will receive keys
// that are not of type TLiteralValue. This is because keys are 
// derived from Guard.Keys which only yields strings. We keep 
// this logic here to remain type-level symmetric.
//
// ------------------------------------------------------------------
type TFromPropertyKeys<Keys extends PropertyKey[], Result extends TSchema[] = []> = (
  Keys extends [infer Left extends PropertyKey, ...infer Right extends PropertyKey[]]
    // Note: We do not need to convert keys into integers, as TypeScript 
    // automatically handles this conversion when deriving property keys using 
    // the `keyof` operator.
    //
    // However, there is some ambiguity: TypeScript does not convert numeric 
    // string keys. As a result, the `ConvertToIntegerKey()` algorithm cannot 
    // determine whether to convert them to integers. `Object.keys()` always 
    // returns strings, meaning numeric-looking strings are converted, but 
    // TypeScript may retain the string when using `keyof`.
    ? Left extends TLiteralValue
      ? TFromPropertyKeys<Right, [...Result, TLiteral<Left>]> // divergence
      : TUnreachable
    : Result
)
function FromPropertyKeys<Keys extends PropertyKey[]>(keys: [...Keys]): TFromPropertyKeys<Keys> {
  const result = keys.reduce<TSchema[]>((result, left) => {
    return IsLiteralValue(left) 
      ? [...result, Literal(ConvertToIntegerKey(left))]
      : Unreachable()
  }, [])
  return result as never
}
// deno-coverage-ignore-stop
// ------------------------------------------------------------------
// FromObject
// ------------------------------------------------------------------
export type TFromObject<Properties extends TProperties,
  PropertyKeys extends PropertyKey[] = TUnionToTuple<keyof Properties>,
  Variants extends TSchema [] = TFromPropertyKeys<PropertyKeys>,
  Result extends TSchema = TEvaluateUnionFast<Variants>
> =  Result

export function FromObject<Properties extends TProperties>(properties: Properties): TFromObject<Properties> {
  const propertyKeys = Guard.Keys(properties)
  const variants = FromPropertyKeys(propertyKeys) as TSchema[]
  const result = EvaluateUnionFast(variants)
  return result as never
}