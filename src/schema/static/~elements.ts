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

import type { XSchema } from '../types/schema.ts'
import type { XMinItems } from '../types/minItems.ts'
import type { XMaxItems } from '../types/maxItems.ts'
import type { XAdditionalItems } from '../types/additionalItems.ts'
import type { XStaticSchema } from './schema.ts'
import type { XLessThan } from './~comparer.ts'

// ------------------------------------------------------------------
// 1: XWithElements
// ------------------------------------------------------------------
type XWithElements<Stack extends string[], Root extends XSchema, Schemas extends XSchema[], Result extends unknown[] = []> = (
  Schemas extends [infer Left extends XSchema, ...infer Right extends XSchema[]]
    ? XWithElements<Stack, Root, Right, [...Result, XStaticSchema<Stack, Root, Left>]>
    : Result
)
// ------------------------------------------------------------------
// 2. XWithMaxItems - Truncate to MaxItems
// ------------------------------------------------------------------
type XWithMaxItemsRemap<Elements extends unknown[], MaxItems extends number, Result extends unknown[] = []> = (
 Elements extends [infer Left extends unknown, ...infer Right extends unknown[]]
  ? XLessThan<Result['length'], MaxItems> extends true
    ? XWithMaxItemsRemap<Right, MaxItems, [...Result, Left]>
    : Result
  : Result
)
type XWithMaxItems<Schema extends XSchema, Elements extends unknown[],
  MaxItems extends number | null = Schema extends XMaxItems<infer MaxItems extends number> ? MaxItems : null,
  Result extends unknown[] = MaxItems extends number ? XWithMaxItemsRemap<Elements, MaxItems> : Elements
> = Result
// ------------------------------------------------------------------
// 3. XNeedsAdditionalItems - Does MaxItems constrain all Elements?
// ------------------------------------------------------------------
type XNeedsAdditionalItems<Schema extends XSchema, Elements extends unknown[],
  MaxItems extends number | null = Schema extends XMaxItems<infer MaxItems extends number> ? MaxItems : null,
  Result extends boolean = MaxItems extends number ? XLessThan<Elements['length'], MaxItems> : true
> = Result
// ------------------------------------------------------------------
// 4. XWithMinItems - Optional Indices > MinItems
// ------------------------------------------------------------------
type XWithMinItemsRemap<Elements extends unknown[], MinItems extends number, Result extends unknown[] = []> = (
  Elements extends [infer Left, ...infer Right]
    ? XLessThan<Result['length'], MinItems> extends true
      ? XWithMinItemsRemap<Right, MinItems, [...Result, Left]>
      : XWithMinItemsRemap<Right, MinItems, [...Result, Left?]>
    : Result
)
type XWithMinItems<Schema extends XSchema, Values extends unknown[],
  MinItems extends number = Schema extends XMinItems<infer MinItems extends number> ? MinItems : 0,
  Result extends unknown[] = XWithMinItemsRemap<Values, MinItems> 
> = Result
// ------------------------------------------------------------------
// 5. XWithAdditionalItems - Append with ...T[]
// ------------------------------------------------------------------
type XWithAdditionalItems<Stack extends string[], Root extends XSchema, Schema extends XSchema, Elements extends unknown[],
  Result extends unknown[] = Schema extends XAdditionalItems<infer Schema extends XSchema> ? (
    Schema extends true ? [...Elements, ...unknown[]] :
    Schema extends false ? [...Elements] :
    [...Elements, ...XStaticSchema<Stack, Root, Schema>[]]
  ) : [...Elements, ...unknown[]]
> = Result
// ------------------------------------------------------------------
// XStaticElements
// ------------------------------------------------------------------
export type XStaticElements<Stack extends string[], Root extends XSchema, Schema extends XSchema, PrefixItems extends XSchema[],
  WithElements extends unknown[] = XWithElements<Stack, Root, PrefixItems>,
  WithMaxItems extends unknown[] = XWithMaxItems<Schema, WithElements>,
  NeedsAdditional extends boolean = XNeedsAdditionalItems<Schema, WithMaxItems>,
  WithMinItems extends unknown[] = XWithMinItems<Schema, WithMaxItems>,
  WithAdditionalItems extends unknown[] = NeedsAdditional extends true 
    ? XWithAdditionalItems<Stack, Root, Schema, WithMinItems>
    : WithMinItems
> = WithAdditionalItems