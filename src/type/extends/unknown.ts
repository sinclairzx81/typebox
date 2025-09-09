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

// deno-fmt-ignore-file

import { type TSchema } from '../types/schema.ts'
import { type TProperties } from '../types/properties.ts'
import { type TAny, IsAny } from '../types/any.ts'
import { type TUnknown, IsUnknown } from '../types/unknown.ts'
import { type TInfer, IsInfer } from '../types/infer.ts'

import { type TExtendsRight, ExtendsRight } from './extends-right.ts'
import * as Result from './result.ts'

export type TExtendsUnknown<Inferred extends TProperties, Left extends TUnknown, Right extends TSchema> = (
  Right extends TInfer ? TExtendsRight<Inferred, Left, Right> :
  Right extends TAny ? Result.TExtendsTrue<Inferred> :
  Right extends TUnknown ? Result.TExtendsTrue<Inferred> :
  Result.TExtendsFalse
)
export function ExtendsUnknown<Inferred extends TProperties, Left extends TUnknown, Right extends TSchema>
  (inferred: Inferred, left: Left, right: Right): 
    TExtendsUnknown<Inferred, Left, Right> {
  return (
    IsInfer(right) ? ExtendsRight(inferred, left, right) :
    IsAny(right) ? Result.ExtendsTrue(inferred) :
    IsUnknown(right) ? Result.ExtendsTrue(inferred) :
    Result.ExtendsFalse()
  ) as never
}
