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

import { type TUnreachable, Unreachable } from '../../../system/unreachable/index.ts'
import { type TProperties, TPropertyKeys, PropertyKeys } from '../../types/properties.ts'
import { type TCyclicCheck, CyclicCheck } from './check.ts'

// ------------------------------------------------------------------
// ResolveCandidateKeys
//
// deno-coverage-ignore-start - symmetric unreachable | internal
//
// This function will always receive keys in Context.
//
// ------------------------------------------------------------------
type TResolveCandidateKeys<Context extends TProperties, Keys extends string[], Result extends string[] = []> = (
  Keys extends [infer Left extends string, ...infer Right extends string[]]
    ? Left extends keyof Context
      ? TCyclicCheck<[Left], Context, Context[Left]> extends true
        ? TResolveCandidateKeys<Context, Right, [...Result, Left]>
        : TResolveCandidateKeys<Context, Right, Result>
    : TUnreachable
  : Result
)
function ResolveCandidateKeys<Context extends TProperties, Keys extends string[]>(context: Context, keys: [...Keys]): TResolveCandidateKeys<Context, Keys> {
  return keys.reduce<string[]>((result, left) => {
    return left in context
      ? CyclicCheck([left], context, context[left])
        ? [...result, left]
        : result
      : Unreachable()
  }, []) as never
}
// deno-coverage-ignore-stop
// ------------------------------------------------------------------
// CyclicCandidates
// ------------------------------------------------------------------
/** Returns keys for context types that need to be transformed to TCyclic. */
export type TCyclicCandidates<Context extends TProperties,
  Keys extends string[] = TPropertyKeys<Context>,
  Result extends string[] = TResolveCandidateKeys<Context, Keys>
> = Result

/** Returns keys for context types that need to be transformed to TCyclic. */
export function CyclicCandidates<Context extends TProperties>(context: Context): TCyclicCandidates<Context> {
  const keys = PropertyKeys(context)
  const result = ResolveCandidateKeys(context, keys)
  return result as never
}