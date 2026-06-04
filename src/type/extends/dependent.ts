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

import { type TProperties } from '../types/properties.ts'
import { type TSchema } from '../types/schema.ts'
import { type TExtendsLeft, ExtendsLeft } from './extends_left.ts'

import * as Result from './result.ts'

// ----------------------------------------------------------------------------
// ExtendsDependent
// ----------------------------------------------------------------------------
export type TExtendsDependent<Inferred extends TProperties, If extends TSchema, Then extends TSchema, Else extends TSchema, Right extends TSchema> = (
  TExtendsLeft<Inferred, If, Right> extends Result.TExtendsTrueLike<infer Inferred extends TProperties>
    ? TExtendsLeft<Inferred, Then, Right>
    : TExtendsLeft<Inferred, Else, Right>
)
export function ExtendsDependent<Inferred extends TProperties, If extends TSchema, Then extends TSchema, Else extends TSchema, Right extends TSchema>
  (inferred: Inferred, if_: If, then_: Then, else_: Else, right: Right):
  TExtendsDependent<Inferred, If, Then, Else, Right> {
    console.log(else_, right)
  return Result.Match(ExtendsLeft(inferred, if_, right), () =>
      ExtendsLeft(inferred, then_, right),
      () => ExtendsLeft(inferred, else_, right)) as never
}