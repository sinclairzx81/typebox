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

import type { TSchema, SchemaOptions } from '../schema/index'
import type { Assert } from '../helpers/index'
import type { TUnion } from '../union/index'
import type { TLiteral } from '../literal/index'
import type { TInteger } from '../integer/index'
import type { TNumber } from '../number/index'
import type { TBigInt } from '../bigint/index'
import type { TString } from '../string/index'
import type { TBoolean } from '../boolean/index'
import type { TNever } from '../never/index'
import type { Static } from '../static/index'

import { TemplateLiteralSyntax, type TTemplateLiteralSyntax } from './syntax'
import { TemplateLiteralPattern } from './pattern'
import { EmptyString } from '../helpers/index'
import { IsString } from '../guard/value'
import { Kind } from '../symbols/index'

// ------------------------------------------------------------------
// TemplateLiteralStaticKind
// ------------------------------------------------------------------
// prettier-ignore
type TemplateLiteralStaticKind<T, Acc extends string> =
  T extends TUnion<infer U> ? { [K in keyof U]: TemplateLiteralStatic<Assert<[U[K]], TTemplateLiteralKind[]>, Acc> }[number] :
  T extends TTemplateLiteral ? `${Static<T>}` :
  T extends TLiteral<infer U> ? `${U}` :
  T extends TString ? `${string}` :
  T extends TNumber ? `${number}` :
  T extends TBigInt ? `${bigint}` :
  T extends TBoolean ? `${boolean}` :
  never
// ------------------------------------------------------------------
// TemplateLiteralStatic
// ------------------------------------------------------------------
// prettier-ignore
type TemplateLiteralStatic<T extends TTemplateLiteralKind[], Acc extends string> =
  T extends [infer L, ...infer R] ? `${TemplateLiteralStaticKind<L, Acc>}${TemplateLiteralStatic<Assert<R, TTemplateLiteralKind[]>, Acc>}` :
  Acc
// ------------------------------------------------------------------
// TTemplateLiteralKind
// ------------------------------------------------------------------
// prettier-ignore
export type TTemplateLiteralKind =
  | TTemplateLiteral
  | TUnion
  | TLiteral
  | TInteger
  | TNumber
  | TBigInt
  | TString
  | TBoolean
  | TNever
// ------------------------------------------------------------------
// TTemplateLiteral
// ------------------------------------------------------------------
// prettier-ignore
export interface TTemplateLiteral<T extends TTemplateLiteralKind[] = TTemplateLiteralKind[]> extends TSchema {
  [Kind]: 'TemplateLiteral'
  static: TemplateLiteralStatic<T, EmptyString>
  type: 'string'
  pattern: string // todo: it may be possible to infer this pattern
}
/** `[Json]` Creates a TemplateLiteral type from template dsl string */
export function TemplateLiteral<T extends string>(syntax: T, options?: SchemaOptions): TTemplateLiteralSyntax<T>
/** `[Json]` Creates a TemplateLiteral type */
export function TemplateLiteral<T extends TTemplateLiteralKind[]>(kinds: [...T], options?: SchemaOptions): TTemplateLiteral<T>
/** `[Json]` Creates a TemplateLiteral type */
// prettier-ignore
export function TemplateLiteral(unresolved: TTemplateLiteralKind[] | string, options: SchemaOptions = {}): any {
  const pattern = IsString(unresolved) 
    ? TemplateLiteralPattern(TemplateLiteralSyntax(unresolved)) 
    : TemplateLiteralPattern(unresolved as TTemplateLiteralKind[])
  return { ...options, [Kind]: 'TemplateLiteral', type: 'string', pattern }
}
