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

import { type TSchema } from '../../types/schema.ts'
import { type TProperties } from '../../types/properties.ts'
import { type TNever, Never } from '../../types/never.ts'
import { type TRef, IsRef } from '../../types/ref.ts'

// ------------------------------------------------------------------
// Resolve - First Non-TRef Target
// ------------------------------------------------------------------
type TResolve<Defs extends TProperties, Ref extends string> = (
  Ref extends keyof Defs
    ? Defs[Ref] extends TRef<infer Ref extends string> 
      ? TResolve<Defs, Ref>
      : Defs[Ref]
    : TNever
)
function Resolve<Defs extends TProperties, Ref extends string>(defs: Defs, ref: Ref): TResolve<Defs, Ref> {
  return (
    ref in defs
      ? IsRef(defs[ref])
        // @ts-ignore 5.0.4 - does not see $ref
        ? Resolve(defs, defs[ref].$ref)
        : defs[ref]
      : Never()
  ) as never
}
// ------------------------------------------------------------------
// CyclicTarget
// ------------------------------------------------------------------
/** Returns the target Type from the Defs or Never if target is non-resolvable */
export type TCyclicTarget<Defs extends TProperties, Ref extends string,
  Result extends TSchema = TResolve<Defs, Ref>
> = Result
/** Returns the target Type from the Defs or Never if target is non-resolvable */
export function CyclicTarget<Defs extends TProperties, Ref extends string>
  (defs: Defs, ref: Ref):
  TCyclicTarget<Defs, Ref> {
  const result = Resolve(defs, ref)
  return result as never
}
