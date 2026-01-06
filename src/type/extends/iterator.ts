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
import { type TIterator, Iterator, IsIterator } from '../types/iterator.ts'

import { type TExtendsRight, ExtendsRight } from './extends-right.ts'
import { type TExtendsLeft, ExtendsLeft } from './extends-left.ts'

export type TExtendsIterator<Inferred extends TProperties, Left extends TSchema, Right extends TSchema> = (
  Right extends TIterator<infer Type extends TSchema>
  ? TExtendsLeft<Inferred, Left, Type>
  : TExtendsRight<Inferred, TIterator<Left>, Right>
)
export function ExtendsIterator<Inferred extends TProperties, Left extends TSchema, Right extends TSchema>
  (inferred: Inferred, left: Left, right: Right): 
    TExtendsIterator<Inferred, Left, Right> {
  return (
    IsIterator(right)
      ? ExtendsLeft(inferred, left, right.iteratorItems)
      : ExtendsRight(inferred, Iterator(left), right)
  ) as never
}
