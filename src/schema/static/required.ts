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
import type { XProperties } from '../types/properties.ts'
import type { TIsReadonly } from './~readonly.ts'
import type { XStaticSchema } from './schema.ts'

// ------------------------------------------------------------------
// ResolveProperties
// ------------------------------------------------------------------
type TResolveProperties<Schema extends XSchema, Result extends Record<PropertyKey, XSchema> = (
  Schema extends XProperties<infer Properties extends Record<PropertyKey, XSchema>> ? Properties : {}
)> = Result
// ------------------------------------------------------------------
// FromKey
// ------------------------------------------------------------------
type TFromKey<Properties extends Record<PropertyKey, XSchema>, Key extends string,
  Readonly extends boolean = Key extends keyof Properties ? TIsReadonly<Properties[Key]> : false,
  Value extends unknown = Key extends keyof Properties ? XStaticSchema<Properties[Key]> : unknown,
  Result extends Record<PropertyKey, unknown> = (
    Readonly extends true
    ? { readonly [_ in Key]: Value }
    : { [_ in Key]: Value }
)> = Result
// ------------------------------------------------------------------
// FromKeys
// ------------------------------------------------------------------
type TFromKeys<Properties extends Record<PropertyKey, XSchema>, Keys extends string[], Result extends Record<PropertyKey, unknown> = {}> = (
  Keys extends [infer Left extends string, ...infer Right extends string[]]
    ? TFromKeys<Properties, Right, Result & TFromKey<Properties, Left>>
    : Result
)
// ------------------------------------------------------------------
// XStaticRequired
// ------------------------------------------------------------------
export type XStaticRequired<Schema extends XSchema, Keys extends string[],
  Properties extends Record<PropertyKey, XSchema> = TResolveProperties<Schema>,
  Result extends Record<PropertyKey, unknown> = TFromKeys<Properties, Keys>
> = Result