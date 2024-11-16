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

import { TemplateLiteralGenerate, type TTemplateLiteralGenerate, type TTemplateLiteral } from '../template-literal/index'
import type { TLiteral, TLiteralValue } from '../literal/index'
import type { TInteger } from '../integer/index'
import type { TNumber } from '../number/index'
import type { TSchema } from '../schema/index'
import type { TUnion } from '../union/index'

// ------------------------------------------------------------------
// TypeGuard
// ------------------------------------------------------------------
import { IsTemplateLiteral, IsUnion, IsLiteral, IsNumber, IsInteger } from '../guard/kind'
// ------------------------------------------------------------------
// FromTemplateLiteral
// ------------------------------------------------------------------
// prettier-ignore
type TFromTemplateLiteral<TemplateLiteral extends TTemplateLiteral, 
  Result extends string[] = TTemplateLiteralGenerate<TemplateLiteral>
> = Result
// prettier-ignore
function FromTemplateLiteral<TemplateLiteral extends TTemplateLiteral>(templateLiteral: TemplateLiteral): TFromTemplateLiteral<TemplateLiteral> {
  const result = TemplateLiteralGenerate(templateLiteral) as string[]
  return result.map(S => S.toString()) as never
}
// ------------------------------------------------------------------
// FromUnion
// ------------------------------------------------------------------
// prettier-ignore
type TFromUnion<Types extends TSchema[], Result extends string[] = []> = (
  Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]] 
    ? TFromUnion<Right, [...Result, ...TIndexPropertyKeys<Left>]>
    : Result
)
// prettier-ignore
function FromUnion<Type extends TSchema[]>(type: Type): TFromUnion<Type> {
  const result = [] as string[]
  for(const left of type) result.push(...IndexPropertyKeys(left))
  return result as never
}
// ------------------------------------------------------------------
// FromLiteral
// ------------------------------------------------------------------
// prettier-ignore
type TFromLiteral<LiteralValue extends TLiteralValue> = (
  LiteralValue extends PropertyKey 
    ? [`${LiteralValue}`] 
    : []
)
// prettier-ignore
function FromLiteral<LiteralValue extends TLiteralValue>(T: LiteralValue): TFromLiteral<LiteralValue> {
  return (
    [(T as string).toString()] // TS 5.4 observes TLiteralValue as not having a toString()
  ) as never
}
// ------------------------------------------------------------------
// IndexedKeyResolve
// ------------------------------------------------------------------
// prettier-ignore
export type TIndexPropertyKeys<Type extends TSchema, Result extends PropertyKey[] = (
  Type extends TTemplateLiteral ? TFromTemplateLiteral<Type> :
  Type extends TUnion<infer Types extends TSchema[]> ? TFromUnion<Types> :
  Type extends TLiteral<infer LiteralValue extends TLiteralValue> ? TFromLiteral<LiteralValue> :
  Type extends TNumber ? ['[number]'] :  
  Type extends TInteger ? ['[number]'] :
  []
)> = Result
/** Returns a tuple of PropertyKeys derived from the given TSchema */
// prettier-ignore
export function IndexPropertyKeys<Type extends TSchema>(type: Type): TIndexPropertyKeys<Type> {
  return [...new Set<string>((
    IsTemplateLiteral(type) ? FromTemplateLiteral(type) :
    IsUnion(type) ? FromUnion(type.anyOf) :
    IsLiteral(type) ? FromLiteral(type.const) :
    IsNumber(type) ? ['[number]'] : 
    IsInteger(type) ? ['[number]'] :
    []
  ))] as never
}
