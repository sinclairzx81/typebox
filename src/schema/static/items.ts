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
import type { XStaticSchema } from './schema.ts'
import type { XStaticElements } from './~elements.ts'

// ------------------------------------------------------------------
// TFromSized
// ------------------------------------------------------------------
type TFromSized<Stack extends string[], Root extends XSchema, Schema extends XSchema, Items extends XSchema[]> = (
  XStaticElements<Stack, Root, Schema, Items>
)
// ------------------------------------------------------------------
// TFromUnsized
// ------------------------------------------------------------------
type TFromUnsized<Stack extends string[], Root extends XSchema, Schema extends XSchema> = (
  XStaticSchema<Stack, Root, Schema>[]
)
// ------------------------------------------------------------------
// XStaticItems
// ------------------------------------------------------------------
export type XStaticItems<Stack extends string[], Root extends XSchema, Schema extends XSchema, Items extends XSchema[] | XSchema,
  Result extends unknown = (
    Items extends XSchema[] ? TFromSized<Stack, Root, Schema, [...Items]> :
    Items extends XSchema ? TFromUnsized<Stack, Root, Items> :
    never
  )
> = Result