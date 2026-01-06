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

import { type TSchema } from '../types/schema.ts'
import { type TProperties } from '../types/properties.ts'
import { type TNull, IsNull } from '../types/null.ts'
import { type TExtendsRight, ExtendsRight } from './extends-right.ts'

import * as Result from './result.ts'

export type TExtendsNull<Inferred extends TProperties, Left extends TNull, Right extends TSchema> = (
  Right extends TNull
  ? Result.TExtendsTrue<Inferred>
  : TExtendsRight<Inferred, Left, Right>
)
export function ExtendsNull<Inferred extends TProperties, Left extends TNull, Right extends TSchema>
  (inferred: Inferred, left: Left, right: Right): 
    TExtendsNull<Inferred, Left, Right> {
  return (
    IsNull(right)
      ? Result.ExtendsTrue(inferred)
      : ExtendsRight(inferred, left, right)
  ) as never
}
