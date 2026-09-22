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

import { RecursionGuard } from '../../../guard/index.ts'
import { type TSchema } from '../../types/schema.ts'
import { type TLiteral, type TLiteralValue, Literal, IsLiteralValue } from '../../types/literal.ts'
import { type TUnion, Union } from '../../types/union.ts'

// ------------------------------------------------------------------
// KeysToLiterals
// ------------------------------------------------------------------
type TKeysToLiterals<Keys extends PropertyKey[], Result extends TLiteral[] = []> = (
  Keys extends [infer Left extends PropertyKey, ...infer Right extends PropertyKey[]]
    ? (
      Left extends TLiteralValue
        ? TKeysToLiterals<Right, [...Result, TLiteral<Left>]>
        : TKeysToLiterals<Right, Result>
    ) : Result
)
const KeysToLiterals = /*#__PURE__*/ RecursionGuard.Recursive(<Keys extends PropertyKey[]>(keys: [...Keys], result: TLiteral[] = []): TKeysToLiterals<Keys> => {
  return RecursionGuard.ShiftLeft(keys, (left, right) => {
    return IsLiteralValue(left)
      ? RecursionGuard.TailCall(KeysToLiterals, right, RecursionGuard.Push(result, Literal(left)))
      : RecursionGuard.TailCall(KeysToLiterals, right, result)
  }, () => result) as never
})
// ------------------------------------------------------------------
// KeysToIndexer
// ------------------------------------------------------------------
export type TKeysToIndexer<Keys extends PropertyKey[],
  Literals extends TLiteral[] = TKeysToLiterals<Keys>,
  Result extends TSchema = TUnion<Literals>
> = Result
export function KeysToIndexer<Keys extends PropertyKey[]>(keys: [...Keys]): TKeysToIndexer<Keys> {
  const literals = KeysToLiterals(keys) as TLiteral[]
  const result = Union(literals)
  return result as never
}