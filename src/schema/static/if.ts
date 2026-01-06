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

import type { XSchema } from '../types/schema.ts'
import type { XStaticSchema } from './schema.ts'
import type { XIf } from '../types/if.ts'
import type { XElse } from '../types/else.ts'
import type { XThen } from '../types/then.ts'

type XStaticIfReduce<Types extends unknown[], Result extends unknown = never> = (
  Types extends [infer Left extends unknown, ...infer Right extends unknown[]]
    ? XStaticIfReduce<Right, Result | Left>
    : Result
)
export type XStaticIf<Stack extends string[], Root extends XSchema, Schema extends XIf, IfSchema extends XSchema,
  Then extends unknown[] = Schema extends XThen<infer ThenSchema extends XSchema> ? [XStaticSchema<Stack, Root, IfSchema> & XStaticSchema<Stack, Root, ThenSchema>] : [],
  Else extends unknown[] = Schema extends XElse<infer ElseSchema extends XSchema> ? [...Then, XStaticSchema<Stack, Root, ElseSchema>] : Then,
  Result extends unknown = Else extends [] ? unknown : XStaticIfReduce<Else>
> = Result