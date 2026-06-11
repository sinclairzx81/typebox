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

import { Guard } from '../../../guard/index.ts'
import { type TProperties } from '../../types/properties.ts'
import { KeyValue, type TKeyValue } from '../../types/_key_value.ts'
import { Literal, type TLiteral, type TLiteralValue } from '../../types/literal.ts'
import type { TUnionToTuple } from '../helpers/union.ts'

// ------------------------------------------------------------------
// Properties
// ------------------------------------------------------------------
type TFromProperties<Context extends TProperties, Properties extends TProperties, Keys extends TLiteralValue[], Result extends TKeyValue[] = []> = (
  Keys extends [infer Left extends TLiteralValue, ...infer Right extends TLiteralValue[]]
    ? Left extends keyof Properties 
      ? TFromProperties<Context, Properties, Right, [...Result, TKeyValue<TLiteral<Left>, Properties[Left]>]>
      : TFromProperties<Context, Properties, Right, Result>
  : Result
)
function FromProperties<Context extends TProperties, Properties extends TProperties, Keys extends TLiteralValue[]>
  (_context: Context, properties: Properties, keys: [...Keys]): TFromProperties<Context, Properties, Keys> {
  return keys.reduce<TKeyValue[]>((result, left) => {
    return Guard.HasPropertyKey(properties, left as keyof Properties) 
      ? [...result, KeyValue(Literal(left), properties[left as keyof Properties])] 
      : result
  }, []) as never
}
// ------------------------------------------------------------------
// Object
// ------------------------------------------------------------------
export type TFromObject<Context extends TProperties, Properties extends TProperties, 
  Keys extends TLiteralValue[] = TUnionToTuple<Extract<keyof Properties, TLiteralValue>>, 
  Result extends TKeyValue[] = TFromProperties<Context, Properties, Keys>
> = Result
export function FromObject<Context extends TProperties, Properties extends TProperties>
  (context: Context, properties: Properties): 
    TFromObject<Context, Properties> {
  const keys = Guard.Keys(properties)
  const result = FromProperties(context, properties, keys)
  return result as never
}
