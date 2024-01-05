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

// ------------------------------------------------------------------
// Type: Module
// ------------------------------------------------------------------
import type { TAny } from '../any/index'
import type { TArray } from '../array/index'
import type { TAsyncIterator } from '../async-iterator/index'
import type { TBigInt } from '../bigint/index'
import type { TBoolean } from '../boolean/index'
import type { TConstructor } from '../constructor/index'
import type { TDate } from '../date/index'
import type { TEnum } from '../enum/index'
import type { TFunction } from '../function/index'
import type { TInteger } from '../integer/index'
import type { TIntersect } from '../intersect/index'
import type { TIterator } from '../iterator/index'
import type { TLiteral } from '../literal/index'
import type { TNot } from '../not/index'
import type { TNull } from '../null/index'
import type { TNumber } from '../number/index'
import type { TObject } from '../object/index'
import type { TPromise } from '../promise/index'
import type { TRecord } from '../record/index'
import type { TThis } from '../recursive/index'
import type { TRef } from '../ref/index'
import type { TRegExp } from '../regexp/index'
import type { TString } from '../string/index'
import type { TSymbol } from '../symbol/index'
import type { TTemplateLiteral } from '../template-literal/index'
import type { TTuple } from '../tuple/index'
import type { TUint8Array } from '../uint8array/index'
import type { TUndefined } from '../undefined/index'
import type { TUnion } from '../union/index'
import type { TUnknown } from '../unknown/index'
import type { TVoid } from '../void/index'
import type { TSchema } from './schema'

export type TAnySchema =
  | TSchema
  | TAny
  | TArray
  | TAsyncIterator
  | TBigInt
  | TBoolean
  | TConstructor
  | TDate
  | TEnum
  | TFunction
  | TInteger
  | TIntersect
  | TIterator
  | TLiteral
  | TNot
  | TNull
  | TNumber
  | TObject
  | TPromise
  | TRecord
  | TRef
  | TRegExp
  | TString
  | TSymbol
  | TTemplateLiteral
  | TThis
  | TTuple
  | TUndefined
  | TUnion
  | TUint8Array
  | TUnknown
  | TVoid
