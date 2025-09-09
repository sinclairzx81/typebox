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

import { Guard } from '../../guard/index.ts'
import { Memory } from '../../system/memory/index.ts'
import { TProperties } from '../types/properties.ts'

export type TResult =
  | TExtendsUnion
  | TExtendsTrue
  | TExtendsFalse
// ------------------------------------------------------------------
// ExtendsUnion
// ------------------------------------------------------------------
export interface TExtendsUnion<Inferred extends TProperties = TProperties> {
  '~kind': 'ExtendsUnion'
  inferred: Inferred
}
export function ExtendsUnion<Inferred extends TProperties>(inferred: TProperties): TExtendsUnion<Inferred> {
  return Memory.Create({ ['~kind']: 'ExtendsUnion' }, { inferred }) as never
}
export function IsExtendsUnion(value: unknown): value is TExtendsUnion {
  return Guard.IsObject(value) &&
    Guard.HasPropertyKey(value, '~kind') &&
    Guard.HasPropertyKey(value, 'inferred') &&
    Guard.IsEqual(value['~kind'], 'ExtendsUnion') &&
    Guard.IsObject(value.inferred)
}
// ------------------------------------------------------------------
// ExtendsTrue
// ------------------------------------------------------------------
export interface TExtendsTrue<Inferred extends TProperties = TProperties> {
  '~kind': 'ExtendsTrue'
  inferred: Inferred
}
export function ExtendsTrue<Inferred extends TProperties>(inferred: TProperties): TExtendsTrue<Inferred> {
  return Memory.Create({ ['~kind']: 'ExtendsTrue' }, { inferred }) as never
}
export function IsExtendsTrue(value: unknown): value is TExtendsTrue {
  return Guard.IsObject(value) &&
    Guard.HasPropertyKey(value, '~kind') &&
    Guard.HasPropertyKey(value, 'inferred') &&
    Guard.IsEqual(value['~kind'], 'ExtendsTrue') &&
    Guard.IsObject(value.inferred)
}
// ------------------------------------------------------------------
// ExtendsUnion
// ------------------------------------------------------------------
export interface TExtendsFalse {
  type: 'ExtendsFalse'
}
export function ExtendsFalse(): TExtendsFalse {
  return Memory.Create({ ['~kind']: 'ExtendsFalse' }, {}) as never
}
export function IsExtendsFalse(value: unknown): value is TExtendsFalse {
  return Guard.IsObject(value) &&
    Guard.HasPropertyKey(value, '~kind') &&
    Guard.IsEqual(value['~kind'], 'ExtendsFalse')
}
// ------------------------------------------------------------------
// ExtendsTrueLike
// ------------------------------------------------------------------
export type TExtendsTrueLike<Inferred extends TProperties = TProperties> =
  | TExtendsUnion<Inferred>
  | TExtendsTrue<Inferred>
export function IsExtendsTrueLike(value: unknown): value is TExtendsTrueLike {
  return IsExtendsUnion(value) || IsExtendsTrue(value)
}
