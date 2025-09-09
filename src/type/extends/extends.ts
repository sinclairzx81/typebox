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
import { type TCyclic, IsCyclic } from '../types/cyclic.ts'
import { type TExtendsLeft, ExtendsLeft } from './extends-left.ts'
import { type TCyclicExtends, CyclicExtends } from '../engine/cyclic/index.ts'

// ------------------------------------------------------------------
// Normal
// ------------------------------------------------------------------
type TNormal<Type extends TSchema> = (
  Type extends TCyclic 
    ? TCyclicExtends<Type> 
    : Type
)
function Normal<Type extends TSchema>(type: Type): TNormal<Type> {
  return (
    IsCyclic(type) 
      ? CyclicExtends(type) 
      : type
  ) as never
}
// ------------------------------------------------------------------
// Extends
// ------------------------------------------------------------------
/** Performs a structural extends check on left and right types and yields inferred types on right if specified. */
export type TExtends<Inferred extends TProperties, Left extends TSchema, Right extends TSchema,
  NormalLeft extends TSchema = TNormal<Left>,
  NormalRight extends TSchema = TNormal<Right>
> = TExtendsLeft<Inferred, NormalLeft, NormalRight>
/** Performs a structural extends check on left and right types and yields inferred types on right if specified. */
export function Extends<Inferred extends TProperties, Left extends TSchema, Right extends TSchema>
  (inferred: Inferred, left: Left, right: Right): 
    TExtends<Inferred, Left, Right> {
  const normalLeft = Normal(left)
  const normalRight = Normal(right)
  return ExtendsLeft(inferred, normalLeft, normalRight)
}
