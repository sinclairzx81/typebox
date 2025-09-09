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
// deno-lint-ignore-file

import { Guard } from '../../../guard/index.ts'
import { type TSchema } from '../../types/schema.ts'
import { type TLiteralValue } from '../../types/literal.ts'
import { type TObject, Object } from '../../types/object.ts'

// ------------------------------------------------------------------
//
// FromLiteralKey
//
// This function accepts a literal key value and returns an object 
// with a single property using that key. It handles string and number 
// keys directly. For boolean literal values, it decomposes them into 
// "true" or "false" keys, following the FromBooleanKey mapping which 
// creates "true" and "false" property keys.
//
// ------------------------------------------------------------------
export type TFromLiteralKey<Key extends TLiteralValue, Value extends TSchema, 
  Result extends TSchema = (
    Key extends string | number ? TObject<{ [_ in Key]: Value }> :
    Key extends false ? TObject<{ false: Value }> :
    Key extends true ? TObject<{ true: Value }> :
    TObject<{}>
  )
> = Result
export function FromLiteralKey<Key extends TLiteralValue, Value extends TSchema>(key: Key, value: Value): TFromLiteralKey<Key, Value> {
  return (
    Guard.IsString(key) || Guard.IsNumber(key) ? Object({ [key]: value }) :
    Guard.IsEqual(key, false) ? Object({ false: value }) :
    Guard.IsEqual(key, true) ? Object({ true: value }) :
    Object({})
  ) as never
}