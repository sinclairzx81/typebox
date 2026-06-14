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

import { type TProperties, type TPropertyKeys, PropertyKeys } from '../../types/properties.ts'
import { type TCyclicCheck, CyclicCheck } from './check.ts'

// ------------------------------------------------------------------
// ResolveCandidateKeys
// ------------------------------------------------------------------
type TResolveCandidateKeys<Context extends TProperties, Keys extends (keyof Context)[], Result extends (keyof Context)[] = []> = (
  Keys extends [infer Left extends keyof Context, ...infer Right extends (keyof Context)[]]
    ? TCyclicCheck<[Left], Context, Context[Left]> extends true
      ? TResolveCandidateKeys<Context, Right, [...Result, Left]>
      : TResolveCandidateKeys<Context, Right, Result>
  : Result
)
function ResolveCandidateKeys<Context extends TProperties, Keys extends (keyof Context)[]>
  (context: Context, keys: [...Keys]): 
    TResolveCandidateKeys<Context, Keys> {
  return keys.reduce<(keyof Context)[]>((result, left) => {
    return CyclicCheck([left], context, context[left])
      ? [...result, left]
      : result
  }, []) as never
}
// ------------------------------------------------------------------
// CyclicCandidates
// ------------------------------------------------------------------
/** Returns keys for context types that need to be transformed to TCyclic. */
export type TCyclicCandidates<Context extends TProperties,
  Keys extends (keyof Context)[] = TPropertyKeys<Context>,
  Result extends (keyof Context)[] = TResolveCandidateKeys<Context, Keys>
> = Result

/** Returns keys for context types that need to be transformed to TCyclic. */
export function CyclicCandidates<Context extends TProperties>(context: Context): TCyclicCandidates<Context> {
  const keys = PropertyKeys(context)
  const result = ResolveCandidateKeys(context, keys)
  return result as never
}