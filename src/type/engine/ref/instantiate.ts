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

import { TProperties } from '../../types/properties.ts'
import { type TRef, Ref } from '../../types/ref.ts'
import { type TState, type TInstantiateType, InstantiateType } from '../instantiate.ts'
import { type TCyclicCheck, CyclicCheck } from '../cyclic/check.ts'

// ------------------------------------------------------------------
// Instantiate
// ------------------------------------------------------------------
export type TRefInstantiate<Context extends TProperties, State extends TState, Ref extends string> = (
  Ref extends keyof Context
    ? TCyclicCheck<[Ref], Context, Context[Ref]> extends true
      ? TRef<Ref>
      : TInstantiateType<Context, State, Context[Ref]>
    : TRef<Ref>
)
export function RefInstantiate<Context extends TProperties, State extends TState, Ref extends string>
  (context: Context, state: State, ref: Ref): 
    TRefInstantiate<Context, State, Ref> {
  return (
    ref in context
      ? CyclicCheck([ref], context, context[ref])
        ? Ref(ref)
        : InstantiateType(context, state, context[ref])
      : Ref(ref)
  ) as never
}